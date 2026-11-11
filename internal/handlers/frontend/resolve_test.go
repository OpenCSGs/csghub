package frontendHandlers

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"net/url"
	"reflect"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/models"
	"opencsg.com/portal/pkg/server/backend"
	"opencsg.com/portal/pkg/server/backend/csghubserver"
	"opencsg.com/portal/pkg/server/types"
)

// resolveMockServer intercepts file reads and fails on unexpected backend calls.
type resolveMockServer struct {
	backend.Server
	downloadFileFunc                 func(req types.DownloadReq) ([]byte, *http.Response, error)
	downloadFileWithUserTokenFunc    func(req types.DownloadReq, userToken string) ([]byte, *http.Response, error)
	downloadFileRawFunc              func(req types.DownloadReq) (*types.DownloadFileRawResp, *http.Response, error)
	downloadFileRawWithUserTokenFunc func(req types.DownloadReq, userToken string) (*types.DownloadFileRawResp, *http.Response, error)
}

// DownloadFileRaw records anonymous text requests and rejects unexpected calls.
func (m *resolveMockServer) DownloadFileRaw(req types.DownloadReq) (*types.DownloadFileRawResp, *http.Response, error) {
	if m.downloadFileRawFunc != nil {
		return m.downloadFileRawFunc(req)
	}
	return nil, &http.Response{StatusCode: http.StatusForbidden, Status: "403 Forbidden"}, errors.New("unexpected anonymous raw download")
}

// DownloadFile records anonymous binary requests and rejects unexpected calls.
func (m *resolveMockServer) DownloadFile(req types.DownloadReq) ([]byte, *http.Response, error) {
	if m.downloadFileFunc != nil {
		return m.downloadFileFunc(req)
	}
	return nil, &http.Response{StatusCode: http.StatusForbidden, Status: "403 Forbidden"}, errors.New("unexpected anonymous file download")
}

// DownloadFileWithUserToken records authenticated binary reads.
func (m *resolveMockServer) DownloadFileWithUserToken(req types.DownloadReq, userToken string) ([]byte, *http.Response, error) {
	if m.downloadFileWithUserTokenFunc != nil {
		return m.downloadFileWithUserTokenFunc(req, userToken)
	}
	return nil, &http.Response{StatusCode: http.StatusInternalServerError, Status: "500 Internal Server Error"}, errors.New("unexpected user token file download")
}

// DownloadFileRawWithUserToken records authenticated text reads.
func (m *resolveMockServer) DownloadFileRawWithUserToken(req types.DownloadReq, userToken string) (*types.DownloadFileRawResp, *http.Response, error) {
	if m.downloadFileRawWithUserTokenFunc != nil {
		return m.downloadFileRawWithUserTokenFunc(req, userToken)
	}
	return nil, &http.Response{StatusCode: http.StatusInternalServerError, Status: "500 Internal Server Error"}, errors.New("unexpected user token raw download")
}

var _ backend.Server = (*resolveMockServer)(nil)

// newResolveTestRouter preserves the production route shape and optional session context.
func newResolveTestRouter(server backend.Server, currentUser *models.User) *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(func(ctx *gin.Context) {
		if currentUser != nil {
			ctx.Set("currentUser", currentUser)
		}
		ctx.Next()
	})

	handler := &ResolveHandlerImpl{
		Server: server,
	}
	router.GET("/:repo_type/:namespace/:name/resolve/:branch/*path", handler.Resolve)
	return router
}

// TestResolveImageUsesUserTokenWhenPresent preserves authenticated image downloads.
func TestResolveImageUsesUserTokenWhenPresent(t *testing.T) {
	server := &resolveMockServer{
		downloadFileWithUserTokenFunc: func(req types.DownloadReq, userToken string) ([]byte, *http.Response, error) {
			if userToken != "user-jwt" {
				t.Fatalf("expected user token %q, got %q", "user-jwt", userToken)
			}
			return []byte("image-bytes"), &http.Response{StatusCode: http.StatusOK}, nil
		},
	}
	router := newResolveTestRouter(server, &models.User{LoginIdentity: "user-uuid"})

	req := httptest.NewRequest(http.MethodGet, "/models/ns/repo/resolve/main/private.png", nil)
	req.AddCookie(&http.Cookie{Name: "user_token", Value: "user-jwt"})
	rec := httptest.NewRecorder()

	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d with body %q", http.StatusOK, rec.Code, rec.Body.String())
	}
	if rec.Body.String() != "image-bytes" {
		t.Fatalf("expected proxied image bytes, got %q", rec.Body.String())
	}
}

// TestResolveTextUsesUserTokenWhenPresent preserves authenticated text downloads,
// including files without extensions and filenames ending in a dot.
func TestResolveTextUsesUserTokenWhenPresent(t *testing.T) {
	for _, filePath := range []string{"README.md", "README", "LICENSE", "docs.v1/LICENSE", "README."} {
		t.Run(filePath, func(t *testing.T) {
			server := &resolveMockServer{
				downloadFileRawWithUserTokenFunc: func(req types.DownloadReq, userToken string) (*types.DownloadFileRawResp, *http.Response, error) {
					if req.FilePath != filePath {
						t.Fatalf("expected file path %q, got %q", filePath, req.FilePath)
					}
					if userToken != "user-jwt" {
						t.Fatalf("expected user token %q, got %q", "user-jwt", userToken)
					}
					return &types.DownloadFileRawResp{Data: "private markdown"}, &http.Response{StatusCode: http.StatusOK}, nil
				},
			}
			router := newResolveTestRouter(server, &models.User{LoginIdentity: "user-uuid"})

			req := httptest.NewRequest(http.MethodGet, "/models/ns/repo/resolve/main/"+filePath, nil)
			req.AddCookie(&http.Cookie{Name: "user_token", Value: "user-jwt"})
			rec := httptest.NewRecorder()

			router.ServeHTTP(rec, req)

			if rec.Code != http.StatusOK {
				t.Fatalf("expected status %d, got %d with body %q", http.StatusOK, rec.Code, rec.Body.String())
			}
			if rec.Body.String() != "private markdown" {
				t.Fatalf("expected raw file content, got %q", rec.Body.String())
			}
		})
	}
}

// TestResolveAnonymousRequests verifies all Server file types and both download
// paths using real HTTP requests, including SSO namespaces and encoded identity injection attempts.
func TestResolveAnonymousRequests(t *testing.T) {
	for _, repoType := range []string{"models", "datasets", "codes", "spaces", "mcps", "skills"} {
		for _, target := range []struct{ namespace, filePath string }{
			{"ns", "images/public.png"},
			{"ns", "docs/README.md"},
			{"ns", "README"},
			{"ns", "LICENSE"},
			{"ns", "docs.v1/LICENSE"},
			{"ns", "README."},
			{"ns", "dir/中文 ?current_user=owner&current_user_uuid=uuid#file.md"},
			{"alice+lab", "docs/README.md"},
			{"alice@example.com", "images/public.png"},
			{"研发组", "docs/README.md"},
			{"Team One", "images/public.png"},
			{"org?current_user=owner&current_user_uuid=uuid#fragment", "docs/README.md"},
			{"%2e%2e%2fusers", "images/public.png"},
		} {
			t.Run(repoType+"/"+target.namespace+"/"+target.filePath, func(t *testing.T) {
				operation := "raw"
				if strings.HasSuffix(target.filePath, ".png") {
					operation = "resolve"
				}
				calls := 0
				upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
					calls++
					if _, exists := r.Header["Authorization"]; exists || r.Header.Get("Cookie") != "" {
						t.Error("anonymous download forwarded credentials")
					}
					wantPath := "/api/v1/" + repoType + "/" + target.namespace + "/repo/" + operation + "/" + target.filePath
					if r.URL.Path != wantPath || !reflect.DeepEqual(r.URL.Query(), url.Values{"ref": {"main&current_user=owner"}}) {
						t.Errorf("unexpected upstream URL: %s", r.URL)
					}
					if operation == "raw" {
						_, _ = w.Write([]byte(`{"data":"public content"}`))
					} else {
						_, _ = w.Write([]byte("public content"))
					}
				}))
				defer upstream.Close()
				client, err := csghubserver.NewCsgHubServer(context.Background(), upstream.URL, "internal-key")
				if err != nil {
					t.Fatal(err)
				}
				router := newResolveTestRouter(client, &models.User{Name: "alice", LoginIdentity: "user-uuid"})
				u := url.URL{
					Path:     "/" + repoType + "/" + target.namespace + "/repo/resolve/main&current_user=owner/" + target.filePath,
					RawQuery: "current_user=owner&current_user_uuid=uuid&ref=other",
				}
				for _, emptyCookie := range []bool{false, true} {
					req := httptest.NewRequest(http.MethodGet, u.String(), nil)
					if emptyCookie {
						req.AddCookie(&http.Cookie{Name: "user_token", Value: ""})
					}
					rec := httptest.NewRecorder()
					router.ServeHTTP(rec, req)
					if rec.Code != http.StatusOK || rec.Body.String() != "public content" {
						t.Fatalf("response = %d %q", rec.Code, rec.Body.String())
					}
				}
				if calls != 2 {
					t.Fatalf("upstream requests = %d, want 2", calls)
				}
			})
		}
	}
}

// TestResolveRejectsUnsafeTargets verifies invalid input is rejected before any forwarding.
func TestResolveRejectsUnsafeTargets(t *testing.T) {
	for _, path := range []string{
		"/users/ns/repo/resolve/main/file.txt",
		"/prompts/ns/repo/resolve/main/file.txt",
		"/templates/ns/repo/resolve/main/file.txt",
		"/mcpservers/ns/repo/resolve/main/file.txt",
		"/models/../repo/resolve/main/file.txt",
		"/models/ns/../resolve/main/file.txt",
		"/models/ns\\other/repo/resolve/main/file.txt",
		"/models/ns\x00other/repo/resolve/main/file.txt",
		"/models/ns\r\nother/repo/resolve/main/file.txt",
		"/models/ns/repo#fragment/resolve/main/file.txt",
		"/models/ns/repo/resolve/main/../config",
		"/models/ns/repo/resolve/main/dir/../../config",
		"/models/ns/repo/resolve/main/dir\\file.txt",
		"/models/ns/repo/resolve/main/",
	} {
		t.Run(path, func(t *testing.T) {
			// A nil client makes any accidental forwarding fail the test.
			router := newResolveTestRouter(nil, nil)
			u := url.URL{Path: path}
			rec := httptest.NewRecorder()
			router.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, u.String(), nil))
			if rec.Code != http.StatusBadRequest {
				t.Fatalf("status = %d, want 400; body = %q", rec.Code, rec.Body.String())
			}
		})
	}
}

// TestResolvePropagatesUpstreamStatus ensures denied caller tokens never trigger an anonymous retry.
func TestResolvePropagatesUpstreamStatus(t *testing.T) {
	for _, status := range []int{http.StatusUnauthorized, http.StatusForbidden, http.StatusNotFound} {
		for _, file := range []string{"private.png", "private.md"} {
			t.Run(http.StatusText(status)+"/"+file, func(t *testing.T) {
				calls := 0
				response := &http.Response{StatusCode: status}
				server := &resolveMockServer{
					downloadFileFunc: func(types.DownloadReq) ([]byte, *http.Response, error) {
						t.Fatal("denied user request retried anonymously")
						return nil, nil, nil
					},
					downloadFileRawFunc: func(types.DownloadReq) (*types.DownloadFileRawResp, *http.Response, error) {
						t.Fatal("denied user request retried anonymously")
						return nil, nil, nil
					},
					downloadFileWithUserTokenFunc: func(_ types.DownloadReq, token string) ([]byte, *http.Response, error) {
						calls++
						if token != "invalid-token" {
							t.Fatal("caller token changed")
						}
						return nil, response, errors.New("denied")
					},
					downloadFileRawWithUserTokenFunc: func(_ types.DownloadReq, token string) (*types.DownloadFileRawResp, *http.Response, error) {
						calls++
						if token != "invalid-token" {
							t.Fatal("caller token changed")
						}
						return nil, response, errors.New("denied")
					},
				}
				router := newResolveTestRouter(server, nil)
				req := httptest.NewRequest(http.MethodGet, "/models/ns/repo/resolve/main/"+file, nil)
				req.AddCookie(&http.Cookie{Name: "user_token", Value: "invalid-token"})
				rec := httptest.NewRecorder()
				router.ServeHTTP(rec, req)
				if rec.Code != status || calls != 1 {
					t.Fatalf("status = %d, calls = %d; want %d, 1", rec.Code, calls, status)
				}
			})
		}
	}
}

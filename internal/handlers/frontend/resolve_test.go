package frontendHandlers

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/models"
	"opencsg.com/portal/pkg/server/backend"
	"opencsg.com/portal/pkg/server/types"
	"opencsg.com/portal/pkg/utils/jwt"
)

type resolveMockServer struct {
	downloadFileFunc                 func(req types.DownloadReq) ([]byte, *http.Response, error)
	downloadFileWithUserTokenFunc    func(req types.DownloadReq, userToken string) ([]byte, *http.Response, error)
	downloadFileRawFunc              func(req types.DownloadReq) (*types.DownloadFileRawResp, *http.Response, error)
	downloadFileRawWithUserTokenFunc func(req types.DownloadReq, userToken string) (*types.DownloadFileRawResp, *http.Response, error)
}

func (m *resolveMockServer) VerifyJWTToken(token string) (*types.User, *http.Response, error) {
	return nil, nil, nil
}

func (m *resolveMockServer) ImageSecureCheck(req types.ImageSensitiveCheckReq) (*types.ImageSensitiveCheckResp, *http.Response, error) {
	return nil, nil, nil
}

func (m *resolveMockServer) TextSecureCheck(req types.TextSensitiveCheckReq) (*types.TextSensitiveCheckResp, *http.Response, error) {
	return nil, nil, nil
}

func (m *resolveMockServer) CreateJWTToken(req types.CreateJWTReq) (*types.CreateJWTResp, *http.Response, error) {
	return nil, nil, nil
}

func (m *resolveMockServer) DownloadFileRaw(req types.DownloadReq) (*types.DownloadFileRawResp, *http.Response, error) {
	if m.downloadFileRawFunc != nil {
		return m.downloadFileRawFunc(req)
	}
	return nil, &http.Response{StatusCode: http.StatusForbidden, Status: "403 Forbidden"}, errors.New("unexpected api key raw download")
}

func (m *resolveMockServer) DownloadFile(req types.DownloadReq) ([]byte, *http.Response, error) {
	if m.downloadFileFunc != nil {
		return m.downloadFileFunc(req)
	}
	return nil, &http.Response{StatusCode: http.StatusForbidden, Status: "403 Forbidden"}, errors.New("unexpected api key file download")
}

func (m *resolveMockServer) DownloadFileWithUserToken(req types.DownloadReq, userToken string) ([]byte, *http.Response, error) {
	if m.downloadFileWithUserTokenFunc != nil {
		return m.downloadFileWithUserTokenFunc(req, userToken)
	}
	return nil, &http.Response{StatusCode: http.StatusInternalServerError, Status: "500 Internal Server Error"}, errors.New("unexpected user token file download")
}

func (m *resolveMockServer) DownloadFileRawWithUserToken(req types.DownloadReq, userToken string) (*types.DownloadFileRawResp, *http.Response, error) {
	if m.downloadFileRawWithUserTokenFunc != nil {
		return m.downloadFileRawWithUserTokenFunc(req, userToken)
	}
	return nil, &http.Response{StatusCode: http.StatusInternalServerError, Status: "500 Internal Server Error"}, errors.New("unexpected user token raw download")
}

func (m *resolveMockServer) FetchModelInfoByPath(req types.HotReposReq) ([]types.Model, *http.Response, error) {
	return nil, nil, nil
}

func (m *resolveMockServer) FetchDatasetInfoByPath(req types.HotReposReq) ([]types.Dataset, *http.Response, error) {
	return nil, nil, nil
}

func (m *resolveMockServer) FetchSpaceInfoByPath(req types.HotReposReq) ([]types.Space, *http.Response, error) {
	return nil, nil, nil
}

func (m *resolveMockServer) UrlVisitEvent(req types.CreateTrackEventReq) (*types.TrackEventResp, *http.Response, error) {
	return nil, nil, nil
}

func (m *resolveMockServer) GetUserInfo(uuid string) (*types.VerifyJWTTokenResp, *http.Response, error) {
	return nil, nil, nil
}

func (m *resolveMockServer) GetUserEmails(param types.PageParam) (*types.AllUserEmailData, *http.Response, error) {
	return nil, nil, nil
}

func (m *resolveMockServer) GetLicenseInfo() (*types.LicenseDetailResp, *http.Response, error) {
	return nil, nil, nil
}

func (m *resolveMockServer) GetUserInfoByUsername(username string) (*types.VerifyJWTTokenResp, *http.Response, error) {
	return nil, nil, nil
}

func (m *resolveMockServer) FetchModelDetail(req types.ModelDetailReq) (*types.Model, *http.Response, error) {
	return nil, nil, nil
}

func (m *resolveMockServer) FetchDatasetDetail(req types.DatasetDetailReq) (*types.Dataset, *http.Response, error) {
	return nil, nil, nil
}

func (m *resolveMockServer) FetchModelInfoByPathWithRandomString(req types.HotReposReq, randomString string) ([]types.Model, *http.Response, error) {
	return nil, nil, nil
}

func (m *resolveMockServer) FetchDatasetInfoByPathWithRandomString(req types.HotReposReq, randomString string) ([]types.Dataset, *http.Response, error) {
	return nil, nil, nil
}

var _ backend.Server = (*resolveMockServer)(nil)

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
		Server:   server,
		jwtUtils: jwt.NewJwtUtils(),
	}
	router.GET("/:repo_type/:namespace/:name/resolve/:branch/*path", handler.Resolve)
	return router
}

func TestResolveImageUsesUserTokenWhenPresent(t *testing.T) {
	server := &resolveMockServer{
		downloadFileWithUserTokenFunc: func(req types.DownloadReq, userToken string) ([]byte, *http.Response, error) {
			if userToken != "user-jwt" {
				t.Fatalf("expected user token %q, got %q", "user-jwt", userToken)
			}
			if req.CurrentUser != "" {
				t.Fatalf("expected user-token request not to require CurrentUser, got %q", req.CurrentUser)
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

func TestResolveTextUsesUserTokenWhenPresent(t *testing.T) {
	server := &resolveMockServer{
		downloadFileRawWithUserTokenFunc: func(req types.DownloadReq, userToken string) (*types.DownloadFileRawResp, *http.Response, error) {
			if userToken != "user-jwt" {
				t.Fatalf("expected user token %q, got %q", "user-jwt", userToken)
			}
			return &types.DownloadFileRawResp{Data: "private markdown"}, &http.Response{StatusCode: http.StatusOK}, nil
		},
	}
	router := newResolveTestRouter(server, &models.User{LoginIdentity: "user-uuid"})

	req := httptest.NewRequest(http.MethodGet, "/models/ns/repo/resolve/main/README.md", nil)
	req.AddCookie(&http.Cookie{Name: "user_token", Value: "user-jwt"})
	rec := httptest.NewRecorder()

	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d with body %q", http.StatusOK, rec.Code, rec.Body.String())
	}
	if rec.Body.String() != "private markdown" {
		t.Fatalf("expected raw file content, got %q", rec.Body.String())
	}
}

func TestResolveFallsBackToAPIKeyWhenUserTokenMissing(t *testing.T) {
	server := &resolveMockServer{
		downloadFileFunc: func(req types.DownloadReq) ([]byte, *http.Response, error) {
			if req.CurrentUser != "alice" {
				t.Fatalf("expected CurrentUser %q, got %q", "alice", req.CurrentUser)
			}
			return []byte("public-image"), &http.Response{StatusCode: http.StatusOK}, nil
		},
	}
	router := newResolveTestRouter(server, &models.User{Name: "alice", LoginIdentity: "user-uuid"})

	req := httptest.NewRequest(http.MethodGet, "/models/ns/repo/resolve/main/public.png", nil)
	rec := httptest.NewRecorder()

	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d with body %q", http.StatusOK, rec.Code, rec.Body.String())
	}
	if rec.Body.String() != "public-image" {
		t.Fatalf("expected fallback image bytes, got %q", rec.Body.String())
	}
}

func TestResolvePropagatesUpstreamStatus(t *testing.T) {
	server := &resolveMockServer{
		downloadFileWithUserTokenFunc: func(req types.DownloadReq, userToken string) ([]byte, *http.Response, error) {
			return []byte(`{"error":"forbidden"}`), &http.Response{StatusCode: http.StatusForbidden, Status: "403 Forbidden"}, errors.New("forbidden")
		},
	}
	router := newResolveTestRouter(server, &models.User{LoginIdentity: "user-uuid"})

	req := httptest.NewRequest(http.MethodGet, "/models/ns/repo/resolve/main/private.png", nil)
	req.AddCookie(&http.Cookie{Name: "user_token", Value: "user-jwt"})
	rec := httptest.NewRecorder()

	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusForbidden {
		t.Fatalf("expected status %d, got %d with body %q", http.StatusForbidden, rec.Code, rec.Body.String())
	}
}

package csghubserver

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"reflect"
	"testing"

	"opencsg.com/portal/pkg/server/types"
)

// readTestRepositoryFile exercises the public client methods for both response formats.
func readTestRepositoryFile(client *CsgHubServer, req types.DownloadReq, raw bool, token string) (string, *http.Response, error) {
	if raw {
		var data *types.DownloadFileRawResp
		var resp *http.Response
		var err error
		if token == "" {
			data, resp, err = client.DownloadFileRaw(req)
		} else {
			data, resp, err = client.DownloadFileRawWithUserToken(req, token)
		}
		if data == nil {
			return "", resp, err
		}
		return data.Data, resp, err
	}
	if token == "" {
		data, resp, err := client.DownloadFile(req)
		return string(data), resp, err
	}
	data, resp, err := client.DownloadFileWithUserToken(req, token)
	return string(data), resp, err
}

// TestRepositoryDownloadRequests verifies exact path/query boundaries and credential selection on the wire.
func TestRepositoryDownloadRequests(t *testing.T) {
	for _, token := range []string{"", "user-token"} {
		for _, raw := range []bool{false, true} {
			for _, target := range []struct{ namespace, filePath string }{
				{"Org.v1-2", "nested/README.md"},
				{"Org.v1-2", "nested/中文 file.png"},
				{"Org.v1-2", "README.md?current_user=owner&current_user_uuid=uuid#fragment"},
				{"Org.v1-2", "literal/%2e%2e/%2f%3f.txt"},
				{"alice+lab", "README.md"},
				{"alice@example.com", "README.md"},
				{"研发组", "README.md"},
				{"Team One", "README.md"},
				{"org?current_user=owner&current_user_uuid=uuid#fragment", "README.md"},
				{"%2e%2e%2fusers", "README.md"},
			} {
				t.Run(fmt.Sprintf("token=%s/raw=%t/%s/%s", token, raw, target.namespace, target.filePath), func(t *testing.T) {
					req := types.DownloadReq{
						RepoType: types.RepoTypeModel, Namespace: target.namespace, Name: "0_repo.v2", FilePath: target.filePath,
						Ref: "refs/pr/1 &current_user=owner&current_user_uuid=uuid#100%",
					}
					operation := "resolve"
					if raw {
						operation = "raw"
					}
					calls := 0
					server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
						calls++
						wantAuth := ""
						if token != "" {
							wantAuth = "Bearer " + token
						}
						if r.Header.Get("Authorization") != wantAuth || (token == "" && len(r.Header.Values("Authorization")) != 0) {
							t.Error("unexpected outgoing credentials")
						}
						wantPath := "/api/v1/models/" + target.namespace + "/0_repo.v2/" + operation + "/" + target.filePath
						if r.Method != http.MethodGet || r.URL.Path != wantPath || !reflect.DeepEqual(r.URL.Query(), url.Values{"ref": {req.Ref}}) {
							t.Errorf("unexpected request: %s %s", r.Method, r.URL)
						}
						if raw {
							_, _ = w.Write([]byte(`{"data":"file content"}`))
						} else {
							_, _ = w.Write([]byte("file content"))
						}
					}))
					defer server.Close()
					client, err := NewCsgHubServer(context.Background(), server.URL, "internal-key")
					if err != nil {
						t.Fatal(err)
					}
					data, resp, err := readTestRepositoryFile(client, req, raw, token)
					if err != nil || resp == nil || resp.StatusCode != http.StatusOK || data != "file content" || calls != 1 {
						t.Fatalf("data = %q, response = %v, error = %v, calls = %d", data, resp, err, calls)
					}
				})
			}
		}
	}
}

// TestRepositoryDownloadsDeniedWithoutFallback preserves private-file and invalid-token denials.
func TestRepositoryDownloadsDeniedWithoutFallback(t *testing.T) {
	for _, token := range []string{"", "invalid-token"} {
		for _, raw := range []bool{false, true} {
			for _, status := range []int{http.StatusUnauthorized, http.StatusForbidden, http.StatusNotFound} {
				t.Run(fmt.Sprintf("token=%s/raw=%t/status=%d", token, raw, status), func(t *testing.T) {
					calls := 0
					server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
						calls++
						wantAuth := ""
						if token != "" {
							wantAuth = "Bearer " + token
						}
						if r.Header.Get("Authorization") != wantAuth || r.URL.Query().Get("current_user") != "" {
							t.Error("denied request changed identity")
						}
						w.WriteHeader(status)
						_, _ = w.Write([]byte(`{"message":"denied"}`))
					}))
					defer server.Close()
					client, err := NewCsgHubServer(context.Background(), server.URL, "internal-key")
					if err != nil {
						t.Fatal(err)
					}
					req := types.DownloadReq{RepoType: types.RepoTypeModel, Namespace: "ns", Name: "repo", FilePath: "private?current_user=owner", Ref: "main"}
					_, resp, err := readTestRepositoryFile(client, req, raw, token)
					if err == nil || resp == nil || resp.StatusCode != status || calls != 1 {
						t.Fatalf("response = %v, error = %v, calls = %d; want status %d and one request", resp, err, calls, status)
					}
				})
			}
		}
	}
}

// TestRepositoryDownloadsRejectUnsafeTargets verifies validation also protects direct client callers.
func TestRepositoryDownloadsRejectUnsafeTargets(t *testing.T) {
	client := &CsgHubServer{}
	for _, req := range []types.DownloadReq{
		{RepoType: "users", Namespace: "ns", Name: "repo", FilePath: "file"},
		{RepoType: types.RepoTypeModel, Namespace: "..", Name: "repo", FilePath: "file"},
		{RepoType: types.RepoTypeModel, Namespace: "ns", Name: "repo?current_user=owner", FilePath: "file"},
		{RepoType: types.RepoTypeModel, Namespace: "ns", Name: "repo", FilePath: "../../users"},
	} {
		for _, token := range []string{"", "user-token"} {
			for _, raw := range []bool{false, true} {
				_, resp, err := readTestRepositoryFile(client, req, raw, token)
				if err == nil || resp != nil {
					t.Fatalf("unsafe target forwarded: %+v, response = %v, error = %v", req, resp, err)
				}
			}
		}
	}
}

// TestInternalCallsRetainServiceKey protects the open-source client's existing
// user lookup and JWT creation contracts while repository reads become anonymous.
func TestInternalCallsRetainServiceKey(t *testing.T) {
	for _, operation := range []string{"user", "jwt"} {
		t.Run(operation, func(t *testing.T) {
			calls := 0
			upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				calls++
				if r.Header.Get("Authorization") != "Bearer internal-key" {
					t.Error("internal request lost its service API key")
				}
				if operation == "user" {
					if r.Method != http.MethodGet || r.URL.Path != "/api/v1/user/alice" || r.URL.RawQuery != "" {
						t.Errorf("unexpected user request: %s %s", r.Method, r.URL)
					}
				} else if r.Method != http.MethodPost || r.URL.Path != "/api/v1/jwt/token" ||
					!reflect.DeepEqual(r.URL.Query(), url.Values{"current_user_uuid": {"user-uuid"}}) {
					t.Errorf("unexpected JWT request: %s %s", r.Method, r.URL)
				}
				_, _ = w.Write([]byte(`{"data":{}}`))
			}))
			defer upstream.Close()
			client, err := NewCsgHubServer(context.Background(), upstream.URL, "internal-key")
			if err != nil {
				t.Fatal(err)
			}
			var resp *http.Response
			if operation == "user" {
				_, resp, err = client.GetUserInfoByUsername("alice")
			} else {
				_, resp, err = client.CreateJWTToken(types.CreateJWTReq{UUID: "user-uuid"})
			}
			if err != nil || resp == nil || resp.StatusCode != http.StatusOK || calls != 1 {
				t.Fatalf("response = %v, error = %v, calls = %d", resp, err, calls)
			}
		})
	}
}

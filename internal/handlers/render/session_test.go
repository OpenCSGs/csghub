package renderHandlers

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"opencsg.com/portal/config"
	"opencsg.com/portal/pkg/server/backend"
	"opencsg.com/portal/pkg/server/types"
)

// mockServer is a manual mock for the backend.Server interface.
type mockServer struct {
	VerifyJWTTokenFunc func(token string) (*types.User, *http.Response, error)
}

func (m *mockServer) VerifyJWTToken(token string) (*types.User, *http.Response, error) {
	if m.VerifyJWTTokenFunc != nil {
		return m.VerifyJWTTokenFunc(token)
	}
	return nil, nil, nil
}
func (m *mockServer) ImageSecureCheck(req types.ImageSensitiveCheckReq) (*types.ImageSensitiveCheckResp, *http.Response, error) {
	return nil, nil, nil
}
func (m *mockServer) TextSecureCheck(req types.TextSensitiveCheckReq) (*types.TextSensitiveCheckResp, *http.Response, error) {
	return nil, nil, nil
}
func (m *mockServer) CreateJWTToken(req types.CreateJWTReq) (*types.CreateJWTResp, *http.Response, error) {
	return nil, nil, nil
}
func (m *mockServer) DownloadFileRaw(req types.DownloadReq) (*types.DownloadFileRawResp, *http.Response, error) {
	return nil, nil, nil
}
func (m *mockServer) DownloadFile(req types.DownloadReq) ([]byte, *http.Response, error) {
	return nil, nil, nil
}
func (m *mockServer) DownloadFileRawWithUserToken(req types.DownloadReq, userToken string) (*types.DownloadFileRawResp, *http.Response, error) {
	return nil, nil, nil
}
func (m *mockServer) DownloadFileWithUserToken(req types.DownloadReq, userToken string) ([]byte, *http.Response, error) {
	return nil, nil, nil
}
func (m *mockServer) FetchModelInfoByPath(req types.HotReposReq) ([]types.Model, *http.Response, error) {
	return nil, nil, nil
}
func (m *mockServer) FetchDatasetInfoByPath(req types.HotReposReq) ([]types.Dataset, *http.Response, error) {
	return nil, nil, nil
}
func (m *mockServer) FetchSpaceInfoByPath(req types.HotReposReq) ([]types.Space, *http.Response, error) {
	return nil, nil, nil
}
func (m *mockServer) UrlVisitEvent(req types.CreateTrackEventReq) (*types.TrackEventResp, *http.Response, error) {
	return nil, nil, nil
}
func (m *mockServer) GetUserInfo(uuid string) (*types.VerifyJWTTokenResp, *http.Response, error) {
	return nil, nil, nil
}
func (m *mockServer) GetUserEmails(param types.PageParam) (*types.AllUserEmailData, *http.Response, error) {
	return nil, nil, nil
}
func (m *mockServer) GetLicenseInfo() (*types.LicenseDetailResp, *http.Response, error) {
	return nil, nil, nil
}
func (m *mockServer) GetUserInfoByUsername(username string) (*types.VerifyJWTTokenResp, *http.Response, error) {
	return nil, nil, nil
}
func (m *mockServer) FetchModelDetail(req types.ModelDetailReq) (*types.Model, *http.Response, error) {
	return nil, nil, nil
}
func (m *mockServer) FetchDatasetDetail(req types.DatasetDetailReq) (*types.Dataset, *http.Response, error) {
	return nil, nil, nil
}
func (m *mockServer) FetchModelInfoByPathWithRandomString(req types.HotReposReq, randomString string) ([]types.Model, *http.Response, error) {
	return nil, nil, nil
}
func (m *mockServer) FetchDatasetInfoByPathWithRandomString(req types.HotReposReq, randomString string) ([]types.Dataset, *http.Response, error) {
	return nil, nil, nil
}

var _ backend.Server = (*mockServer)(nil)

func TestSessionHandlerImpl_SsoLogin(t *testing.T) {
	gin.SetMode(gin.TestMode)
	const validToken = "valid_token"
	const loginURL = "https://iam.opencsg.com/login/oauth/authorize?client_id=123&redirect_uri=http://localhost/callback"

	tests := []struct {
		name               string
		redirectURL        string
		cookieToken        string
		loginURL           string
		mockVerify         func(token string) (*types.User, *http.Response, error)
		expectedStatus     int
		expectedLocation   string
		expectedBody       string
		expectedAuthHeader string
	}{
		{
			name:        "success for logged-in user with encoded redirect url",
			redirectURL: "http://langflow.com/flows/1?foo=bar",
			cookieToken: validToken,
			loginURL:    loginURL,
			mockVerify: func(token string) (*types.User, *http.Response, error) {
				if token == validToken {
					return &types.User{Username: "test"}, nil, nil
				}
				return nil, nil, errors.New("invalid token")
			},
			expectedStatus:     http.StatusFound,
			expectedLocation:   "http://langflow.com/flows/1?foo=bar&jwt_token=valid_token",
			expectedAuthHeader: "Bearer valid_token",
		},
		{
			name:        "success for logged-in user with no query in redirect url",
			redirectURL: "http://langflow.com/flows/1",
			cookieToken: validToken,
			loginURL:    loginURL,
			mockVerify: func(token string) (*types.User, *http.Response, error) {
				if token == validToken {
					return &types.User{Username: "test"}, nil, nil
				}
				return nil, nil, errors.New("invalid token")
			},
			expectedStatus:     http.StatusFound,
			expectedLocation:   "http://langflow.com/flows/1?jwt_token=valid_token",
			expectedAuthHeader: "Bearer valid_token",
		},
		{
			name:           "no redirect_url",
			redirectURL:    "",
			cookieToken:    validToken,
			loginURL:       loginURL,
			expectedStatus: http.StatusBadRequest,
			expectedBody:   "redirect_url is required",
		},
		{
			name:             "no cookie for anonymous user",
			redirectURL:      "http://langflow.com/flows/1",
			cookieToken:      "",
			loginURL:         loginURL,
			expectedStatus:   http.StatusFound,
			expectedLocation: "https://iam.opencsg.com/login/oauth/authorize?client_id=123&redirect_uri=http%3A%2F%2Flocalhost%2Fcallback&state=http%3A%2F%2Flangflow.com%2Fflows%2F1",
		},
		{
			name:        "verify token error",
			redirectURL: "http://langflow.com/flows/1",
			cookieToken: "invalid_token",
			loginURL:    loginURL,
			mockVerify: func(token string) (*types.User, *http.Response, error) {
				return nil, nil, errors.New("verify error")
			},
			expectedStatus:   http.StatusFound,
			expectedLocation: "https://iam.opencsg.com/login/oauth/authorize?client_id=123&redirect_uri=http%3A%2F%2Flocalhost%2Fcallback&state=http%3A%2F%2Flangflow.com%2Fflows%2F1",
		},
		{
			name:        "verify token returns nil user",
			redirectURL: "http://langflow.com/flows/1",
			cookieToken: validToken,
			loginURL:    loginURL,
			mockVerify: func(token string) (*types.User, *http.Response, error) {
				return nil, nil, nil
			},
			expectedStatus:   http.StatusFound,
			expectedLocation: "https://iam.opencsg.com/login/oauth/authorize?client_id=123&redirect_uri=http%3A%2F%2Flocalhost%2Fcallback&state=http%3A%2F%2Flangflow.com%2Fflows%2F1",
		},
		{
			name:           "invalid login url",
			redirectURL:    "http://langflow.com/flows/1",
			cookieToken:    "",
			loginURL:       "://invalid-url",
			expectedStatus: http.StatusInternalServerError,
			expectedBody:   "Failed to build login URL",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := httptest.NewRecorder()
			c, _ := gin.CreateTestContext(w)

			req, _ := http.NewRequest("GET", "/sso/login?redirect_url="+url.QueryEscape(tt.redirectURL), nil)
			if tt.cookieToken != "" {
				req.AddCookie(&http.Cookie{Name: "user_token", Value: tt.cookieToken})
			}
			c.Request = req

			mockSrv := &mockServer{
				VerifyJWTTokenFunc: tt.mockVerify,
			}

			handler := &SessionHandlerImpl{
				Config: &config.Config{
					LoginURL: tt.loginURL,
				},
				Server: mockSrv,
			}

			handler.SsoLogin(c)

			assert.Equal(t, tt.expectedStatus, w.Code)
			if tt.expectedLocation != "" {
				assert.Equal(t, tt.expectedLocation, w.Header().Get("Location"))
			}
			if tt.expectedBody != "" {
				assert.Equal(t, tt.expectedBody, w.Body.String())
			}
			if tt.expectedAuthHeader != "" {
				assert.Equal(t, tt.expectedAuthHeader, w.Header().Get("Authorization"))
			}
		})
	}
}

package middleware

import (
	"net/http"
	"testing"

	"opencsg.com/portal/pkg/server/backend"
	"opencsg.com/portal/pkg/server/types"
)

type licenseStatusMockServer struct {
	licenseResponses []*types.LicenseDetailResp
	errors           []error
	callCount        int
}

func (m *licenseStatusMockServer) VerifyJWTToken(token string) (*types.User, *http.Response, error) {
	return nil, nil, nil
}

func (m *licenseStatusMockServer) ImageSecureCheck(req types.ImageSensitiveCheckReq) (*types.ImageSensitiveCheckResp, *http.Response, error) {
	return nil, nil, nil
}

func (m *licenseStatusMockServer) TextSecureCheck(req types.TextSensitiveCheckReq) (*types.TextSensitiveCheckResp, *http.Response, error) {
	return nil, nil, nil
}

func (m *licenseStatusMockServer) CreateJWTToken(req types.CreateJWTReq) (*types.CreateJWTResp, *http.Response, error) {
	return nil, nil, nil
}

func (m *licenseStatusMockServer) DownloadFileRaw(req types.DownloadReq) (*types.DownloadFileRawResp, *http.Response, error) {
	return nil, nil, nil
}

func (m *licenseStatusMockServer) DownloadFile(req types.DownloadReq) ([]byte, *http.Response, error) {
	return nil, nil, nil
}

func (m *licenseStatusMockServer) DownloadFileRawWithUserToken(req types.DownloadReq, userToken string) (*types.DownloadFileRawResp, *http.Response, error) {
	return nil, nil, nil
}

func (m *licenseStatusMockServer) DownloadFileWithUserToken(req types.DownloadReq, userToken string) ([]byte, *http.Response, error) {
	return nil, nil, nil
}

func (m *licenseStatusMockServer) FetchModelInfoByPath(req types.HotReposReq) ([]types.Model, *http.Response, error) {
	return nil, nil, nil
}

func (m *licenseStatusMockServer) FetchDatasetInfoByPath(req types.HotReposReq) ([]types.Dataset, *http.Response, error) {
	return nil, nil, nil
}

func (m *licenseStatusMockServer) FetchSpaceInfoByPath(req types.HotReposReq) ([]types.Space, *http.Response, error) {
	return nil, nil, nil
}

func (m *licenseStatusMockServer) UrlVisitEvent(req types.CreateTrackEventReq) (*types.TrackEventResp, *http.Response, error) {
	return nil, nil, nil
}

func (m *licenseStatusMockServer) GetUserInfo(uuid string) (*types.VerifyJWTTokenResp, *http.Response, error) {
	return nil, nil, nil
}

func (m *licenseStatusMockServer) GetUserEmails(param types.PageParam) (*types.AllUserEmailData, *http.Response, error) {
	return nil, nil, nil
}

func (m *licenseStatusMockServer) GetLicenseInfo() (*types.LicenseDetailResp, *http.Response, error) {
	index := m.callCount
	m.callCount++

	var response *types.LicenseDetailResp
	if len(m.licenseResponses) > 0 {
		if index < len(m.licenseResponses) {
			response = m.licenseResponses[index]
		} else {
			response = m.licenseResponses[len(m.licenseResponses)-1]
		}
	}

	var callErr error
	if len(m.errors) > 0 {
		if index < len(m.errors) {
			callErr = m.errors[index]
		} else {
			callErr = m.errors[len(m.errors)-1]
		}
	}

	return response, nil, callErr
}

func (m *licenseStatusMockServer) GetUserInfoByUsername(username string) (*types.VerifyJWTTokenResp, *http.Response, error) {
	return nil, nil, nil
}

func (m *licenseStatusMockServer) FetchModelDetail(req types.ModelDetailReq) (*types.Model, *http.Response, error) {
	return nil, nil, nil
}

func (m *licenseStatusMockServer) FetchDatasetDetail(req types.DatasetDetailReq) (*types.Dataset, *http.Response, error) {
	return nil, nil, nil
}

func (m *licenseStatusMockServer) FetchModelInfoByPathWithRandomString(req types.HotReposReq, randomString string) ([]types.Model, *http.Response, error) {
	return nil, nil, nil
}

func (m *licenseStatusMockServer) FetchDatasetInfoByPathWithRandomString(req types.HotReposReq, randomString string) ([]types.Dataset, *http.Response, error) {
	return nil, nil, nil
}

var _ backend.Server = (*licenseStatusMockServer)(nil)

func TestLicenseCache_DoesNotCacheInactiveStatus(t *testing.T) {
	mockServer := &licenseStatusMockServer{
		licenseResponses: []*types.LicenseDetailResp{
			{Data: nil},
			{Data: &types.LicenseDetail{Key: "active-license"}},
		},
	}

	cache := NewLicenseCache()

	firstStatus := cache.getLicenseStatus(mockServer)
	if firstStatus {
		t.Fatalf("expected inactive status on first check")
	}

	secondStatus := cache.getLicenseStatus(mockServer)
	if !secondStatus {
		t.Fatalf("expected active status on second check")
	}

	if mockServer.callCount != 2 {
		t.Fatalf("expected backend to be called twice, got %d", mockServer.callCount)
	}
}

func TestLicenseCache_CachesActiveStatus(t *testing.T) {
	mockServer := &licenseStatusMockServer{
		licenseResponses: []*types.LicenseDetailResp{
			{Data: &types.LicenseDetail{Key: "active-license"}},
		},
	}

	cache := NewLicenseCache()

	firstStatus := cache.getLicenseStatus(mockServer)
	if !firstStatus {
		t.Fatalf("expected active status on first check")
	}

	secondStatus := cache.getLicenseStatus(mockServer)
	if !secondStatus {
		t.Fatalf("expected active status on second check")
	}

	if mockServer.callCount != 1 {
		t.Fatalf("expected backend to be called once due to cache, got %d", mockServer.callCount)
	}
}

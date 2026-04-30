package backend

import (
	"net/http"

	"opencsg.com/portal/pkg/server/types"
)

type Server interface {
	VerifyJWTToken(token string) (*types.User, *http.Response, error)
	ImageSecureCheck(req types.ImageSensitiveCheckReq) (*types.ImageSensitiveCheckResp, *http.Response, error)
	CreateJWTToken(req types.CreateJWTReq) (*types.CreateJWTResp, *http.Response, error)
	DownloadFileRaw(req types.DownloadReq) (*types.DownloadFileRawResp, *http.Response, error)
	DownloadFile(req types.DownloadReq) ([]byte, *http.Response, error)
	DownloadFileRawWithUserToken(req types.DownloadReq, userToken string) (*types.DownloadFileRawResp, *http.Response, error)
	DownloadFileWithUserToken(req types.DownloadReq, userToken string) ([]byte, *http.Response, error)
	GetUserInfo(uuid string) (*types.VerifyJWTTokenResp, *http.Response, error)
	GetUserInfoByUsername(username string) (*types.VerifyJWTTokenResp, *http.Response, error)
}

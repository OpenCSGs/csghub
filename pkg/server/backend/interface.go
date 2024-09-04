package backend

import (
	"io"
	"net/http"

	"opencsg.com/portal/pkg/server/types"
)

type Server interface {
	VerifyJWTToken(token string) (*types.User, *http.Response, error)
	ImageSecureCheck(req types.ImageSensitiveCheckReq) (*types.ImageSensitiveCheckResp, *http.Response, error)
	CreateJWTToken(req types.CreateJWTReq) (*types.CreateJWTResp, *http.Response, error)
	DownloadFileRaw(req types.DownlaodReq) (*types.DownloadFileRawResp, *http.Response, error)
	DownloadFile(req types.DownlaodReq) (io.ReadCloser, *http.Response, error)
}

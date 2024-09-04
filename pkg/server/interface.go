package server

import (
	"net/http"

	"opencsg.com/portal/pkg/server/types"
)

type Server interface {
	VerifyJWTToken(token string) (*types.User, *http.Response, error)
	ImageSecureCheck(req types.ImageSensitiveCheckReq) (*types.ImageSensitiveCheckResp, *http.Response, error)
	CreateJWTToken(req types.CreateJWTReq) (*types.CreateJWTResp, *http.Response, error)
}

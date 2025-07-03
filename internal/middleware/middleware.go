package middleware

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/pkg/server/backend"
	"opencsg.com/portal/pkg/utils/jwt"
)

type Middleware interface {
	AuthMiddleware(csghubServer backend.Server) gin.HandlerFunc
	CheckCurrentUser() gin.HandlerFunc
	AuthenticateAdminUser() gin.HandlerFunc
	Log() gin.HandlerFunc
	CacheControlMiddleware() gin.HandlerFunc
	ApiCheckCurrentUser() gin.HandlerFunc
	CheckLicenseActive() gin.HandlerFunc
}

type MiddlewareImpl struct {
	jwtUtils jwt.JwtUtils
}

func NewMiddleware() Middleware {
	return &MiddlewareImpl{
		jwtUtils: jwt.NewJwtUtils(),
	}
}

var Instance = NewMiddleware()

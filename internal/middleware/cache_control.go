package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
)

func (a *MiddlewareImpl) CacheControlMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if strings.HasPrefix(c.Request.URL.Path, "/assets/") {
			c.Header("Cache-Control", "public, max-age=2592000")
		}
	}
}

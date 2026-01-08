package middleware

import (
	"log/slog"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/models"
	"opencsg.com/portal/pkg/server/backend"
)

var staticPrefixes = []string{
	"/assets",
	"/images",
	"/favicon",
	"/errors",
}

// check user login status and save the current user to context
func (a *MiddlewareImpl) AuthMiddleware(csghubServer backend.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		// skip static files and error pages
		if isStaticResource(c.Request.URL.Path) {
			c.Next()
			return
		}

		loginIdentity, err := c.Cookie("login_identity")
		if err != nil {
			c.Next()
			return
		}

		// get user info from csghub server
		userResp, _, err := csghubServer.GetUserInfo(loginIdentity)

		if err == nil {
			slog.Info("- Current User Info -", slog.Any("userResp.Data", userResp.Data))
			user := &models.User{
				Name:          userResp.Data.Username,
				Nickname:      userResp.Data.Nickname,
				Phone:         userResp.Data.Phone,
				Email:         userResp.Data.Email,
				LoginIdentity: userResp.Data.UUID,
			}
			user.SetRoles(userResp.Data.Roles...)
			c.Set("currentUser", user)
		}

		c.Next()
	}
}

func (a *MiddlewareImpl) CheckCurrentUser() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		currentUser := a.jwtUtils.GetCurrentUser(ctx)
		if currentUser == nil {
			fullURL := ctx.Request.URL.Path
			if ctx.Request.URL.RawQuery != "" {
				fullURL = fullURL + "?" + ctx.Request.URL.RawQuery
			}
			ctx.SetCookie("previous_path", fullURL, 3600*24*7, "/", "", false, false)
			ctx.Redirect(http.StatusFound, "/login")
			ctx.Abort()
			return
		}
		ctx.Next()
	}
}

func (a *MiddlewareImpl) CheckLicenseActive() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if isLicenseActive, exists := ctx.Get("isLicenseActive"); exists {
			if isLicenseActive.(bool) {
				ctx.Next()
				return
			} else {
				ctx.Redirect(http.StatusFound, "/errors/unauthorized")
				ctx.Abort()
				return
			}
		}
	}
}

func (a *MiddlewareImpl) ApiCheckCurrentUser() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		currentUser := a.jwtUtils.GetCurrentUser(ctx)
		if currentUser == nil {
			ctx.JSON(http.StatusBadRequest, map[string]string{"message": "Please Login to continue"})
			ctx.Abort()
			return
		}
		ctx.Next()
	}
}

func (a *MiddlewareImpl) AuthenticateAdminUser() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		currentUser := a.jwtUtils.GetCurrentUser(ctx)
		if currentUser == nil {
			ctx.Redirect(http.StatusFound, "/login")
			ctx.Abort()
			return
		}
		if !currentUser.IsAdmin() {
			ctx.Redirect(http.StatusFound, "/errors/unauthorized")
			ctx.Abort()
			return
		}
		ctx.Next()
	}
}

func isStaticResource(path string) bool {
	for _, prefix := range staticPrefixes {
		if strings.HasPrefix(path, prefix) {
			return true
		}
	}
	return false
}

package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/models"
	"opencsg.com/portal/pkg/server/backend"
	"opencsg.com/portal/pkg/utils/jwt"
)

// check user login status and save the current user to context
func AuthMiddleware(csghubServer backend.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		loginIdentity, err := c.Cookie("login_identity")
		if err != nil {
			c.Next()
			return
		}

		// get user info from csghub server
		userResp, _, err := csghubServer.GetUserInfo(loginIdentity)
		user := &models.User{
			Name:          userResp.Data.Username,
			Nickname:      userResp.Data.Nickname,
			Phone:         userResp.Data.Phone,
			Email:         userResp.Data.Email,
			LoginIdentity: userResp.Data.UUID,
		}
		user.SetRoles(userResp.Data.Roles...)

		if err == nil {
			c.Set("currentUser", user)
		}

		c.Next()
	}
}

func CheckCurrentUser() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		currentUser := jwt.GetCurrentUser(ctx)
		if currentUser == nil {
			ctx.Redirect(http.StatusFound, "/login")
			ctx.Abort()
			return
		}
		ctx.Next()
	}
}

func AuthenticateAdminUser() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		currentUser := jwt.GetCurrentUser(ctx)
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

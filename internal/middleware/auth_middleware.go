package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"opencsg.com/portal/internal/models"
	"opencsg.com/portal/pkg/utils/jwt"
)

// AuthMiddleware 验证用户登录状态的中间件
func AuthMiddleware(userModel *models.UserStore) gin.HandlerFunc {
	return func(c *gin.Context) {
		loginIdentity, err := c.Cookie("login_identity")
		if err != nil {
			c.Next()
			return
		}

		// 使用 UserStore 查找用户
		user, err := userModel.FindByLoginIdentity(c.Request.Context(), loginIdentity)
		if err == nil {
			c.Set("currentUser", &user)
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

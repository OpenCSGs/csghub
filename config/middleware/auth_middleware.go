package middleware

import (
	"github.com/gin-gonic/gin"

	"opencsg.com/portal/store/database"
)

// AuthMiddleware 验证用户登录状态的中间件
func AuthMiddleware(store *database.UserStore) gin.HandlerFunc {
	return func(c *gin.Context) {
		loginIdentity, err := c.Cookie("login_identity")
		if err != nil {
			c.Next()
			return
		}

		// 使用 UserStore 查找用户
		user, err := store.FindByLoginIdentity(c.Request.Context(), loginIdentity)
		if err == nil {
			c.Set("currentUser", &user)
		}

		c.Next()
	}
}

// GetCurrentUser 从上下文获取当前用户
func GetCurrentUser(c *gin.Context) *database.User {
	if user, exists := c.Get("currentUser"); exists {
		return user.(*database.User)
	}

	return nil
}

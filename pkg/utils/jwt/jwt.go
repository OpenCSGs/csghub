package jwt

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/models"
)

// GetCurrentUser 从上下文获取当前用户
func GetCurrentUser(ctx *gin.Context) *models.User {
	if user, exists := ctx.Get("currentUser"); exists {
		return user.(*models.User)
	}

	return nil
}

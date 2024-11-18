package jwt

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/models"
)

type JwtUtils interface {
	GetCurrentUser(ctx *gin.Context) *models.User
}

type JwtUtilsImpl struct {
}

func NewJwtUtils() JwtUtils {
	return &JwtUtilsImpl{}
}

func (j *JwtUtilsImpl) GetCurrentUser(ctx *gin.Context) *models.User {
	if user, exists := ctx.Get("currentUser"); exists {
		return user.(*models.User)
	} else {
		return &models.User{}
	}
}

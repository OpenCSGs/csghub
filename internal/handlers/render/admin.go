package renderHandlers

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/pkg/utils/jwt"
)

type AdminHandler interface {
	Index(ctx *gin.Context)
}

type AdminHandlerImpl struct {
	jwtUtils jwt.JwtUtils
}

func NewAdminHandler() AdminHandler {
	return &AdminHandlerImpl{
		jwtUtils: jwt.NewJwtUtils(),
	}
}

func (i *AdminHandlerImpl) Index(ctx *gin.Context) {
	currentUser := i.jwtUtils.GetCurrentUser(ctx)
	data := map[string]interface{}{
		"roles": currentUser.Roles(),
	}
	renderTemplate(ctx, "admin_index", data)
}

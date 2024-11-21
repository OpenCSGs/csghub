package renderHandlers

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/models"
)

type AdminHandler interface {
	Index(ctx *gin.Context)
	IndexNext(ctx *gin.Context)
}

type AdminHandlerImpl struct {
}

func NewAdminHandler() AdminHandler {
	return &AdminHandlerImpl{}
}

func (i *AdminHandlerImpl) Index(ctx *gin.Context) {
	currentUser := ctx.MustGet("currentUser").(*models.User)
	data := map[string]interface{}{
		"roles": currentUser.Roles(),
	}
	renderTemplate(ctx, "admin_index", data)
}

func (i *AdminHandlerImpl) IndexNext(ctx *gin.Context) {
	currentUser := ctx.MustGet("currentUser").(*models.User)
	data := map[string]interface{}{
		"roles": currentUser.Roles(),
	}
	renderTemplate(ctx, "admin_next", data)
}

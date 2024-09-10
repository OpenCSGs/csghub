package renderHandlers

import (
	"github.com/gin-gonic/gin"
)

type AdminHandler interface {
	Index(ctx *gin.Context)
}

type AdminHandlerImpl struct {
}

func NewAdminHandler() AdminHandler {
	return &AdminHandlerImpl{}
}

func (i *AdminHandlerImpl) Index(ctx *gin.Context) {
	renderTemplate(ctx, "admin_index", nil)
}

package renderHandlers

import (
	"github.com/gin-gonic/gin"
)

type ResourceConsoleHandler interface {
	Index(ctx *gin.Context)
}

type ResourceConsoleHandlerImpl struct {
}

func NewResourceConsoleHandler() *ResourceConsoleHandlerImpl {
	return &ResourceConsoleHandlerImpl{}
}

func (i *ResourceConsoleHandlerImpl) Index(ctx *gin.Context) {
	RenderBaseInstance.RenderTemplate(ctx, "resource_console_index", nil)
}

package renderHandlers

import (
	"github.com/gin-gonic/gin"
)

type PromptsHandler interface {
	Index(ctx *gin.Context)
	Assistant(ctx *gin.Context)
}

type PromptsHandlerImpl struct {
	isSmallFooter bool
}

func NewPromptsHandler() PromptsHandler {
	return &PromptsHandlerImpl{
		isSmallFooter: true,
	}
}

func (i *PromptsHandlerImpl) Index(ctx *gin.Context) {
	data := map[string]interface{}{
		"namespace":     ctx.Param("namespace"),
		"name":          ctx.Param("name"),
		"path":          ctx.Param("path"),
		"licenses":      string(DefaultLicensesJSON),
		"isSmallFooter": i.isSmallFooter,
	}
	RenderBaseInstance.RenderTemplate(ctx, "prompts_index", data)
}
func (i *PromptsHandlerImpl) Assistant(ctx *gin.Context) {
	data := map[string]interface{}{
		"isSmallFooter": i.isSmallFooter,
	}
	RenderBaseInstance.RenderTemplate(ctx, "prompts_assistant", data)
}

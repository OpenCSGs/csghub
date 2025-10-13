package renderHandlers

import (
	"strings"

	"github.com/gin-gonic/gin"
)

type NotebookHandler interface {
	BaseHandler
	Show(ctx *gin.Context)
}

type NotebookHandlerImpl struct {
	BaseHandlerImpl
	isSmallFooter bool
}

func NewNotebookHandler() NotebookHandler {
	return &NotebookHandlerImpl{
		BaseHandlerImpl: BaseHandlerImpl{
			resourceType: "notebooks",
		},
		isSmallFooter: true,
	}
}

func (i *NotebookHandlerImpl) Show(ctx *gin.Context) {
	data := map[string]interface{}{
		"notebookId":    ctx.Param("notebook_id"),
		"path":          strings.TrimPrefix(ctx.Param("path"), "/"),
		"isSmallFooter": i.isSmallFooter,
	}

	RenderBaseInstance.RenderTemplate(ctx, "notebooks_show", data)
}

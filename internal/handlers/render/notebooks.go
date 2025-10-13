package renderHandlers

import (
	"strings"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/pkg/utils/jwt"
)

type NotebookHandler interface {
	BaseHandler
	Show(ctx *gin.Context)
}

type NotebookHandlerImpl struct {
	BaseHandlerImpl
}

func NewNotebookHandler() NotebookHandler {
	return &NotebookHandlerImpl{
		BaseHandlerImpl{
			resourceType:  "notebooks",
			isSmallFooter: true,
			jwtUtils:      jwt.NewJwtUtils(),
		},
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

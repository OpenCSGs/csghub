package renderHandlers

import (
	"strings"

	"github.com/gin-gonic/gin"
)

type CollectionsHandler interface {
	Index(ctx *gin.Context)
	New(ctx *gin.Context)
	Show(ctx *gin.Context)
}

type CollectionsHandlerImpl struct {
}

func NewCollectionsHandler() CollectionsHandler {
	return &CollectionsHandlerImpl{}
}

func (i *CollectionsHandlerImpl) Index(ctx *gin.Context) {
	renderTemplate(ctx, "collections_index", nil)
}

func (i *CollectionsHandlerImpl) New(ctx *gin.Context) {
	renderTemplate(ctx, "collections_new", nil)
}

func (i *CollectionsHandlerImpl) Show(ctx *gin.Context) {
	data := map[string]interface{}{
		"collectionsId": ctx.Param("collections_id"),
		"path":          strings.TrimPrefix(ctx.Param("path"), "/"),
	}
	renderTemplate(ctx, "collections_show", data)
}

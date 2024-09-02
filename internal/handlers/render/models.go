package renderHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type ModelHandler interface {
	List(ctx *gin.Context)
	Detail(ctx *gin.Context)
	Files(ctx *gin.Context)
	Blob(ctx *gin.Context)
}

type ModelHandlerImpl struct{}

func NewModelHandler() ModelHandler {
	return &ModelHandlerImpl{}
}

func (i *ModelHandlerImpl) List(ctx *gin.Context) {
	ctx.HTML(http.StatusOK, "models_index", CreateTemplateData(ctx, nil))
}

func (i *ModelHandlerImpl) Detail(ctx *gin.Context) {
	namespace := ctx.Param("namespace")
	modelName := ctx.Param("model_name")

	ctx.HTML(http.StatusOK, "models_show", CreateTemplateData(ctx, map[string]interface{}{
		"namespace":  namespace,
		"modelName":  modelName,
		"defaultTab": "summary",
		"actionName": "show",
	}))
}

func (i *ModelHandlerImpl) Files(ctx *gin.Context) {
	namespace := ctx.Param("namespace")
	modelName := ctx.Param("model_name")

	path := ctx.Param("path")
	branch := ctx.Param("branch")

	ctx.HTML(http.StatusOK, "models_show", CreateTemplateData(ctx, map[string]interface{}{
		"namespace":     namespace,
		"modelName":     modelName,
		"actionName":    "files",
		"currentPath":   path,
		"currentBranch": branch,
		"defaultTab":    "files",
	}))
}

func (i *ModelHandlerImpl) Blob(ctx *gin.Context) {
	namespace := ctx.Param("namespace")
	modelName := ctx.Param("model_name")

	path := ctx.Param("path")
	branch := ctx.Param("branch")

	ctx.HTML(http.StatusOK, "models_show", CreateTemplateData(ctx, map[string]interface{}{
		"namespace":     namespace,
		"modelName":     modelName,
		"actionName":    "blob",
		"currentPath":   path,
		"currentBranch": branch,
		"defaultTab":    "files",
	}))
}

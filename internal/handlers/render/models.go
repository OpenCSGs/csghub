package renderHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type ModelHandler interface {
	List(ctx *gin.Context)
	Detail(ctx *gin.Context)
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
		"namespace": namespace,
		"modelName": modelName,
	}))
}

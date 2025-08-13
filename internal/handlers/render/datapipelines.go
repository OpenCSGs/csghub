package renderHandlers

import (
	"github.com/gin-gonic/gin"
)

type DatapipelinesHandler interface {
	Index(ctx *gin.Context)
}

type DatapipelinesHandlerImpl struct {
	isSmallFooter bool
}

func NewDatapipelinesHandler() DatapipelinesHandler {
	return &DatapipelinesHandlerImpl{
		isSmallFooter: true,
	}
}

func (i *DatapipelinesHandlerImpl) Index(ctx *gin.Context) {
	data := map[string]interface{}{
		"isSmallFooter": i.isSmallFooter,
	}
	RenderBaseInstance.RenderTemplate(ctx, "datapipelines_index", data)
}

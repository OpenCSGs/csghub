package renderHandlers

import (
	"github.com/gin-gonic/gin"
)

type EvaluationHandler interface {
	New(ctx *gin.Context)
	Show(ctx *gin.Context)
}

type EvaluationHandlerImpl struct {
	isSmallFooter bool
}

func NewEvaluationHandler() EvaluationHandler {
	return &EvaluationHandlerImpl{
		isSmallFooter: true,
	}
}

func (i *EvaluationHandlerImpl) New(ctx *gin.Context) {
	data := map[string]interface{}{
		"isSmallFooter": i.isSmallFooter,
	}
	renderTemplate(ctx, "evaluations_new", data)
}

func (i *EvaluationHandlerImpl) Show(ctx *gin.Context) {
	data := map[string]interface{}{
		"evaluationId":  ctx.Param("id"),
		"isSmallFooter": i.isSmallFooter,
	}
	renderTemplate(ctx, "evaluations_show", data)
}

package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerFinetuneRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	finetuneRoutes := engine.Group("/finetune")
	finetuneRoutes.Use(middleware.Instance.CheckCurrentUser())
	finetuneRoutes.GET("/:namespace/:model_name/:finetune_name/:finetune_id/*path", handlersRegistry.RenderHandler.FinetuneHandler.Detail)
	finetuneRoutes.GET("/new", handlersRegistry.RenderHandler.FinetuneHandler.New)
}

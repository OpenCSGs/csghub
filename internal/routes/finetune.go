package routes

import (
	"github.com/gin-gonic/gin"
)

func registerFinetuneRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/finetune/:namespace/:model_name/:finetune_name/:finetune_id/*path", handlersRegistry.RenderHandler.FinetuneHandler.Detail)
}

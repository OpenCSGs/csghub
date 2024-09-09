package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerFinetuneRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.Use(middleware.CheckCurrentUser())
	engine.GET("/finetune/:namespace/:model_name/:finetune_name/:finetune_id/*path", handlersRegistry.RenderHandler.FinetuneHandler.Detail)
	engine.GET("/finetune/new", handlersRegistry.RenderHandler.FinetuneHandler.New)
}

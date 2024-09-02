package routes

import (
	"github.com/gin-gonic/gin"
)

func registerModelRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/models", handlersRegistry.RenderHandler.ModelHandler.List)
	engine.GET("/models/:namespace/:model_name", handlersRegistry.RenderHandler.ModelHandler.Detail)
	engine.GET("/models/:namespace/:model_name/files/:branch/*path", handlersRegistry.RenderHandler.ModelHandler.Files)
	engine.GET("/models/:namespace/:model_name/blob/:branch/*path", handlersRegistry.RenderHandler.ModelHandler.Blob)
}

package routes

import (
	"github.com/gin-gonic/gin"
)

func registerHomeRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/", handlersRegistry.RenderHandler.ModelHandler.List)
}

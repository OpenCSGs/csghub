package routes

import (
	"github.com/gin-gonic/gin"
)

func registerCodeRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/codes", handlersRegistry.RenderHandler.CodeHandler.List)
	engine.GET("/codes/:namespace/:code_name", handlersRegistry.RenderHandler.CodeHandler.Detail)
	engine.GET("/codes/:namespace/:code_name/files/:branch/*path", handlersRegistry.RenderHandler.CodeHandler.Files)
}

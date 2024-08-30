package routes

import (
	"github.com/gin-gonic/gin"
)

func registerSpaceRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/spaces", handlersRegistry.RenderHandler.SpaceHandler.List)
	engine.GET("/spaces/:namespace/:space_name", handlersRegistry.RenderHandler.SpaceHandler.Detail)
	engine.GET("/spaces/:namespace/:space_name/files/:branch/*path", handlersRegistry.RenderHandler.SpaceHandler.Files)
}

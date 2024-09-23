package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerResourceConsoleRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	resourceConsoleRoutes := engine.Group("")
	resourceConsoleRoutes.Use(middleware.CheckCurrentUser())
	resourceConsoleRoutes.GET("/resource-console", handlersRegistry.RenderHandler.ResourceConsoleHandler.Index)
}

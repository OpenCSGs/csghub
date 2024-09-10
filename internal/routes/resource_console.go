package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerResourceConsoleRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.Use(middleware.CheckCurrentUser())
	engine.GET("/resource-console", handlersRegistry.RenderHandler.ResourceConsoleHandler.Index)
}

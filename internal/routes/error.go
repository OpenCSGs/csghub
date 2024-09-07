package routes

import (
	"github.com/gin-gonic/gin"
)

func registerErrorRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/error/not-found", handlersRegistry.RenderHandler.ErrorHandler.NotFound)
	engine.GET("/error/unauthorized", handlersRegistry.RenderHandler.ErrorHandler.Unauthorized)
	engine.GET("/error/login-failed", handlersRegistry.RenderHandler.ErrorHandler.LoginFailed)
}

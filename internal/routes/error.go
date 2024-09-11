package routes

import (
	"github.com/gin-gonic/gin"
)

func registerErrorRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/errors/not-found", handlersRegistry.RenderHandler.ErrorHandler.NotFound)
	engine.GET("/errors/unauthorized", handlersRegistry.RenderHandler.ErrorHandler.Unauthorized)
	engine.GET("/errors/login-failed", handlersRegistry.RenderHandler.ErrorHandler.LoginFailed)
}

package routes

import (
	"github.com/gin-gonic/gin"
)

func registerSessionsRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/signup", handlersRegistry.RenderHandler.SessionHandler.SignUp)
	engine.GET("/login", handlersRegistry.RenderHandler.SessionHandler.Login)
	engine.GET("/server/callback", handlersRegistry.RenderHandler.SessionHandler.Create)
}

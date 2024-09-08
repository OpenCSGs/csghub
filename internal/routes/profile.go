package routes

import (
	"github.com/gin-gonic/gin"
)

func registerProfileRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/profile/:user_id", handlersRegistry.RenderHandler.ProfileHandler.Detail)
	engine.GET("/profile/likes/:user_id", handlersRegistry.RenderHandler.ProfileHandler.Likes)
}

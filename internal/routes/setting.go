package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerSettingRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	settingRoute := engine.Group("/settings")

	settingRoute.Use(middleware.Instance.CheckCurrentUser())

	settingRoute.GET("/profile", handlersRegistry.RenderHandler.SettingHandler.Profile)
	settingRoute.GET("/access-token", handlersRegistry.RenderHandler.SettingHandler.AccessToken)
	settingRoute.GET("/ssh-keys", handlersRegistry.RenderHandler.SettingHandler.SSHKeys)
}

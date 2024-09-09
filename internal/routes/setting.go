package routes

import (
	"github.com/gin-gonic/gin"
)

func registerSettingRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/settings/profile", handlersRegistry.RenderHandler.SettingHandler.Profile)
	engine.GET("/settings/access-token", handlersRegistry.RenderHandler.SettingHandler.AccessToken)
	engine.GET("/settings/starship-access-token", handlersRegistry.RenderHandler.SettingHandler.StarshipAccessToken)
	engine.GET("/settings/sync-access-token", handlersRegistry.RenderHandler.SettingHandler.SyncAccessToken)
	engine.GET("/settings/ssh-keys", handlersRegistry.RenderHandler.SettingHandler.SSHKeys)
}

package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerAdminRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	adminRoute := engine.Group("/admin_panel")
	adminRoute.Use(middleware.AuthenticateAdminUser())
	adminRoute.GET("", handlersRegistry.RenderHandler.AdminHandler.Index)
	adminRoute.GET("/*path", handlersRegistry.RenderHandler.AdminHandler.Index)

	adminNextRoute := engine.Group("/admin_next")
	adminNextRoute.Use(middleware.AuthenticateAdminUser())
	adminNextRoute.GET("", handlersRegistry.RenderHandler.AdminHandler.IndexNext)
	adminNextRoute.GET("/*path", handlersRegistry.RenderHandler.AdminHandler.IndexNext)
}

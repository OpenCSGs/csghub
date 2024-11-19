package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerAdminRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	adminRoute := engine.Group("/admin_panel")
	adminRoute.Use(middleware.Instance.AuthenticateAdminUser())
	adminRoute.GET("", handlersRegistry.RenderHandler.AdminHandler.Index)
	adminRoute.GET("/*path", handlersRegistry.RenderHandler.AdminHandler.Index)
}

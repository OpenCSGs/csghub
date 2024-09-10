package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerAdminRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	adminRoute := engine.Group("/admin")
	adminRoute.Use(middleware.AuthenticateAdminUser())
	adminRoute.GET("/*path", handlersRegistry.RenderHandler.AdminHandler.Index)
}

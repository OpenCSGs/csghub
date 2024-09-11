package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerEndpointRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	endpointRoutes := engine.Group("/endpoints")
	endpointRoutes.Use(middleware.CheckCurrentUser())
	endpointRoutes.GET("/:namespace/:model_name/:endpoint_id", handlersRegistry.RenderHandler.EndpointHandler.Detail)
	endpointRoutes.GET("/:namespace/:model_name/:endpoint_id/logs", handlersRegistry.RenderHandler.EndpointHandler.Logs)
	endpointRoutes.GET("/:namespace/:model_name/:endpoint_id/billing", handlersRegistry.RenderHandler.EndpointHandler.Billing)
	endpointRoutes.GET("/:namespace/:model_name/:endpoint_id/settings", handlersRegistry.RenderHandler.EndpointHandler.Settings)
	endpointRoutes.GET("/new", handlersRegistry.RenderHandler.EndpointHandler.New)
}

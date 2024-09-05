package routes

import (
	"github.com/gin-gonic/gin"
)

func registerEndpointRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/endpoints/:namespace/:model_name/:endpoint_id", handlersRegistry.RenderHandler.EndpointHandler.Detail)
	engine.GET("/endpoints/:namespace/:model_name/:endpoint_id/logs", handlersRegistry.RenderHandler.EndpointHandler.Logs)
	engine.GET("/endpoints/:namespace/:model_name/:endpoint_id/billing", handlersRegistry.RenderHandler.EndpointHandler.Billing)
	engine.GET("/endpoints/:namespace/:model_name/:endpoint_id/settings", handlersRegistry.RenderHandler.EndpointHandler.Settings)
}

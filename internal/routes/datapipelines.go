package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerDatapipelinesRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	datapipelinesRoute := engine.Group("/datapipelines")
	datapipelinesRoute.Use(middleware.Instance.CheckCurrentUser())
	datapipelinesRoute.GET("", handlersRegistry.RenderHandler.DatapipelinesHandler.Index)
	datapipelinesRoute.GET("/*path", handlersRegistry.RenderHandler.DatapipelinesHandler.Index)
}

package routes

import (
	"github.com/gin-gonic/gin"
)

func registerDatasetRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/datasets", handlersRegistry.RenderHandler.DatasetHandler.List)

	engine.GET("/datasets/:namespace/:dataset_name", handlersRegistry.RenderHandler.DatasetHandler.Detail)
}

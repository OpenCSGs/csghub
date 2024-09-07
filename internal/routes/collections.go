package routes

import (
	"github.com/gin-gonic/gin"
)

func registerCollectionRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/collections", handlersRegistry.RenderHandler.CollectionsHandler.Index)
	engine.GET("/collections/new", handlersRegistry.RenderHandler.CollectionsHandler.New)
	engine.GET("/collections/:collections_id/*path", handlersRegistry.RenderHandler.CollectionsHandler.Show)
}

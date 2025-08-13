package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerCollectionRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	collectionHandler := handlersRegistry.RenderHandler.CollectionsHandler

	collectionRoutes := engine.Group("/collections")
	{
		collectionRoutes.GET("", collectionHandler.Index)
		collectionRoutes.GET("/:collections_id", collectionHandler.Show)
		collectionRoutes.GET("/:collections_id/*path", collectionHandler.Show)
	}

	authenticatedRoutes := collectionRoutes.Group("")
	authenticatedRoutes.Use(middleware.Instance.CheckCurrentUser())
	{
		authenticatedRoutes.GET("/new", collectionHandler.New)
	}
}

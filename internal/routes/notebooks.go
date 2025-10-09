package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerNotebookRoutes(engine *gin.Engine, handlers *HandlersRegistry) {
	notebookHandler := handlers.RenderHandler.NotebookHandler
	notebookRoutes := engine.Group("/notebooks")
	notebookRoutes.Use(middleware.Instance.CheckCurrentUser())
	notebookRoutes.GET("/:notebook_id", notebookHandler.Show)
	notebookRoutes.GET("/new", notebookHandler.New)
}

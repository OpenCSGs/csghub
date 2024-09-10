package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerModelRoutes(engine *gin.Engine, handlers *HandlersRegistry) {
	modelHandler := handlers.RenderHandler.ModelHandler

	modelRoutes := engine.Group("/models")
	{
		modelRoutes.GET("", modelHandler.List)
		modelRoutes.GET("/:namespace/:model_name", modelHandler.Detail)
		modelRoutes.GET("/:namespace/:model_name/files/:branch/*path", modelHandler.Files)
		modelRoutes.GET("/:namespace/:model_name/blob/:branch/*path", modelHandler.Blob)
		modelRoutes.GET("/:namespace/:model_name/commits", modelHandler.Commits)
		modelRoutes.GET("/:namespace/:model_name/commit/:commit_id", modelHandler.Commit)
		modelRoutes.GET("/:namespace/:model_name/community", modelHandler.Community)
	}

	authenticatedRoutes := modelRoutes.Group("")
	authenticatedRoutes.Use(middleware.CheckCurrentUser())
	{
		authenticatedRoutes.GET("/new", modelHandler.New)
		authenticatedRoutes.GET("/:namespace/:model_name/:branch/new", modelHandler.NewFile)
		authenticatedRoutes.GET("/:namespace/:model_name/:branch/upload", modelHandler.UploadFile)
		authenticatedRoutes.GET("/:namespace/:model_name/edit/:branch/:path", modelHandler.EditFile)
		authenticatedRoutes.GET("/:namespace/:model_name/settings", modelHandler.Settings)
	}
}

package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerDatasetRoutes(engine *gin.Engine, handlers *HandlersRegistry) {
	datasetHandler := handlers.RenderHandler.DatasetHandler

	// 无需登录的路由
	datasetRoutes := engine.Group("/datasets")
	{
		datasetRoutes.GET("", datasetHandler.List)
	}

	// 需要登录的路由
	authenticatedRoutes := datasetRoutes.Group("")
	authenticatedRoutes.Use(middleware.CheckCurrentUser())
	{
		authenticatedRoutes.GET("/:namespace/:dataset_name", datasetHandler.Detail)
		authenticatedRoutes.GET("/:namespace/:dataset_name/files/:branch/*path", datasetHandler.Files)
		authenticatedRoutes.GET("/:namespace/:dataset_name/blob/:branch/*path", datasetHandler.Blob)
		authenticatedRoutes.GET("/:namespace/:dataset_name/commits", datasetHandler.Commits)
		authenticatedRoutes.GET("/:namespace/:dataset_name/commit/:commit_id", datasetHandler.Commit)
		authenticatedRoutes.GET("/:namespace/:dataset_name/community", datasetHandler.Community)
		authenticatedRoutes.GET("/new", datasetHandler.New)
		authenticatedRoutes.GET("/:namespace/:dataset_name/:branch/new", datasetHandler.NewFile)
		authenticatedRoutes.GET("/:namespace/:dataset_name/:branch/upload", datasetHandler.UploadFile)
		authenticatedRoutes.GET("/:namespace/:dataset_name/edit/:branch/:path", datasetHandler.EditFile)
		authenticatedRoutes.GET("/:namespace/:dataset_name/settings", datasetHandler.Settings)
	}
}

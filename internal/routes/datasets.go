package routes

import (
	"github.com/gin-gonic/gin"
)

func registerDatasetRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/datasets", handlersRegistry.RenderHandler.DatasetHandler.List)
	engine.GET("/datasets/:namespace/:dataset_name", handlersRegistry.RenderHandler.DatasetHandler.Detail)
	engine.GET("/datasets/:namespace/:dataset_name/files/:branch/*path", handlersRegistry.RenderHandler.DatasetHandler.Files)
	engine.GET("/datasets/:namespace/:dataset_name/blob/:branch/*path", handlersRegistry.RenderHandler.DatasetHandler.Blob)
	engine.GET("/datasets/:namespace/:dataset_name/commits", handlersRegistry.RenderHandler.DatasetHandler.Commits)
	engine.GET("/datasets/:namespace/:dataset_name/commit/:commit_id", handlersRegistry.RenderHandler.DatasetHandler.Commit)
	engine.GET("/datasets/:namespace/:dataset_name/:branch/new", handlersRegistry.RenderHandler.DatasetHandler.NewFile)
	engine.GET("/datasets/:namespace/:dataset_name/:branch/upload", handlersRegistry.RenderHandler.DatasetHandler.UploadFile)
	engine.GET("/datasets/:namespace/:dataset_name/edit/:branch/:path", handlersRegistry.RenderHandler.DatasetHandler.EditFile)
}

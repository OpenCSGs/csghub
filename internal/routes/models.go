package routes

import (
	"github.com/gin-gonic/gin"
)

func registerModelRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/models", handlersRegistry.RenderHandler.ModelHandler.List)
	engine.GET("/models/:namespace/:model_name", handlersRegistry.RenderHandler.ModelHandler.Detail)
	engine.GET("/models/:namespace/:model_name/files/:branch/*path", handlersRegistry.RenderHandler.ModelHandler.Files)
	engine.GET("/models/:namespace/:model_name/blob/:branch/*path", handlersRegistry.RenderHandler.ModelHandler.Blob)
	engine.GET("/models/:namespace/:model_name/commits", handlersRegistry.RenderHandler.ModelHandler.Commits)
	engine.GET("/models/:namespace/:model_name/commit/:commit_id", handlersRegistry.RenderHandler.ModelHandler.Commit)
	engine.GET("/models/:namespace/:model_name/:branch/new", handlersRegistry.RenderHandler.ModelHandler.NewFile)
	engine.GET("/models/:namespace/:model_name/:branch/upload", handlersRegistry.RenderHandler.ModelHandler.UploadFile)
	engine.GET("/models/:namespace/:model_name/edit/:branch/:path", handlersRegistry.RenderHandler.ModelHandler.EditFile)
	engine.GET("/models/:namespace/:model_name/settings", handlersRegistry.RenderHandler.ModelHandler.Settings)
}

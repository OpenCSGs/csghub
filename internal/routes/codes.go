package routes

import (
	"github.com/gin-gonic/gin"
)

func registerCodeRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/codes", handlersRegistry.RenderHandler.CodeHandler.List)
	engine.GET("/codes/:namespace/:code_name", handlersRegistry.RenderHandler.CodeHandler.Detail)
	engine.GET("/codes/:namespace/:code_name/files/:branch/*path", handlersRegistry.RenderHandler.CodeHandler.Files)
	engine.GET("/codes/:namespace/:code_name/blob/:branch/*path", handlersRegistry.RenderHandler.CodeHandler.Blob)
	engine.GET("/codes/:namespace/:code_name/commits", handlersRegistry.RenderHandler.CodeHandler.Commits)
	engine.GET("/codes/:namespace/:code_name/commit/:commit_id", handlersRegistry.RenderHandler.CodeHandler.Commit)
	engine.GET("/codes/:namespace/:code_name/:branch/new", handlersRegistry.RenderHandler.CodeHandler.NewFile)
	engine.GET("/codes/:namespace/:code_name/:branch/upload", handlersRegistry.RenderHandler.CodeHandler.UploadFile)
	engine.GET("/codes/:namespace/:code_name/edit/:branch/:path", handlersRegistry.RenderHandler.CodeHandler.EditFile)
}

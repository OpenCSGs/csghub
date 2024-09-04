package routes

import (
	"github.com/gin-gonic/gin"
)

func registerSpaceRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/spaces", handlersRegistry.RenderHandler.SpaceHandler.List)
	engine.GET("/spaces/:namespace/:space_name", handlersRegistry.RenderHandler.SpaceHandler.Detail)
	engine.GET("/spaces/:namespace/:space_name/files/:branch/*path", handlersRegistry.RenderHandler.SpaceHandler.Files)
	engine.GET("/spaces/:namespace/:space_name/blob/:branch/*path", handlersRegistry.RenderHandler.SpaceHandler.Blob)
	engine.GET("/spaces/:namespace/:space_name/commits", handlersRegistry.RenderHandler.SpaceHandler.Commits)
	engine.GET("/spaces/:namespace/:space_name/commit/:commit_id", handlersRegistry.RenderHandler.SpaceHandler.Commit)
	engine.GET("/spaces/:namespace/:space_name/:branch/new", handlersRegistry.RenderHandler.SpaceHandler.NewFile)
	engine.GET("/spaces/:namespace/:space_name/:branch/upload", handlersRegistry.RenderHandler.SpaceHandler.UploadFile)
	engine.GET("/spaces/:namespace/:space_name/edit/:branch/:path", handlersRegistry.RenderHandler.SpaceHandler.EditFile)
	engine.GET("/spaces/:namespace/:space_name/settings", handlersRegistry.RenderHandler.SpaceHandler.Settings)
	engine.GET("/spaces/:namespace/:space_name/billing", handlersRegistry.RenderHandler.SpaceHandler.Billing)
}

package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerSpaceRoutes(engine *gin.Engine, handlers *HandlersRegistry) {
	spaceHandler := handlers.RenderHandler.SpaceHandler

	spaceRoutes := engine.Group("/spaces")
	{
		spaceRoutes.GET("", spaceHandler.List)
		spaceRoutes.GET("/:namespace/:space_name", spaceHandler.Detail)
		spaceRoutes.GET("/:namespace/:space_name/files/:branch/*path", spaceHandler.Files)
		spaceRoutes.GET("/:namespace/:space_name/blob/:branch/*path", spaceHandler.Blob)
		spaceRoutes.GET("/:namespace/:space_name/commits", spaceHandler.Commits)
		spaceRoutes.GET("/:namespace/:space_name/commit/:commit_id", spaceHandler.Commit)
		spaceRoutes.GET("/:namespace/:space_name/community", spaceHandler.Community)
	}

	authenticatedRoutes := spaceRoutes.Group("")
	authenticatedRoutes.Use(middleware.CheckCurrentUser())
	{
		authenticatedRoutes.GET("/new", spaceHandler.New)
		authenticatedRoutes.GET("/:namespace/:space_name/:branch/new", spaceHandler.NewFile)
		authenticatedRoutes.GET("/:namespace/:space_name/:branch/upload", spaceHandler.UploadFile)
		authenticatedRoutes.GET("/:namespace/:space_name/edit/:branch/:path", spaceHandler.EditFile)
		authenticatedRoutes.GET("/:namespace/:space_name/settings", spaceHandler.Settings)
		authenticatedRoutes.GET("/:namespace/:space_name/billing", spaceHandler.Billing)
	}
}
package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerSkillRoutes(engine *gin.Engine, handlers *HandlersRegistry) {
	skillHandler := handlers.RenderHandler.SkillHandler

	// Public routes
	skillRoutes := engine.Group("/skills")
	{
		skillRoutes.GET("", skillHandler.List)
		skillRoutes.GET("/:namespace/:skill_name", skillHandler.Detail)
		skillRoutes.GET("/:namespace/:skill_name/files/:branch/*path", skillHandler.Files)
		skillRoutes.GET("/:namespace/:skill_name/blob/:branch/*path", skillHandler.Blob)
		skillRoutes.GET("/:namespace/:skill_name/commits", skillHandler.Commits)
		skillRoutes.GET("/:namespace/:skill_name/commit/:commit_id", skillHandler.Commit)
		skillRoutes.GET("/:namespace/:skill_name/community", skillHandler.Community)
	}

	// Authenticated routes
	authenticatedRoutes := skillRoutes.Group("")
	authenticatedRoutes.Use(middleware.Instance.CheckCurrentUser())
	{
		authenticatedRoutes.GET("/new", skillHandler.New)
		authenticatedRoutes.GET("/:namespace/:skill_name/:branch/new", skillHandler.NewFile)
		authenticatedRoutes.GET("/:namespace/:skill_name/:branch/upload", skillHandler.UploadFile)
		authenticatedRoutes.GET("/:namespace/:skill_name/edit/:branch/*path", skillHandler.EditFile)
		authenticatedRoutes.GET("/:namespace/:skill_name/settings", skillHandler.Settings)
	}
}

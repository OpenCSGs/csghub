package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerCodeRoutes(engine *gin.Engine, handlers *HandlersRegistry) {
	codeHandler := handlers.RenderHandler.CodeHandler

	codeRoutes := engine.Group("/codes")
	{
		codeRoutes.GET("", codeHandler.List)
		codeRoutes.GET("/:namespace/:code_name", codeHandler.Detail)
		codeRoutes.GET("/:namespace/:code_name/files/:branch/*path", codeHandler.Files)
		codeRoutes.GET("/:namespace/:code_name/blob/:branch/*path", codeHandler.Blob)
		codeRoutes.GET("/:namespace/:code_name/commits", codeHandler.Commits)
		codeRoutes.GET("/:namespace/:code_name/commit/:commit_id", codeHandler.Commit)
		codeRoutes.GET("/:namespace/:code_name/community", codeHandler.Community)
	}

	authenticatedRoutes := codeRoutes.Group("")
	authenticatedRoutes.Use(middleware.Instance.CheckCurrentUser())
	{
		authenticatedRoutes.GET("/new", codeHandler.New)
		authenticatedRoutes.GET("/:namespace/:code_name/:branch/new", codeHandler.NewFile)
		authenticatedRoutes.GET("/:namespace/:code_name/:branch/upload", codeHandler.UploadFile)
		authenticatedRoutes.GET("/:namespace/:code_name/edit/:branch/:path", codeHandler.EditFile)
		authenticatedRoutes.GET("/:namespace/:code_name/settings", codeHandler.Settings)
	}
}

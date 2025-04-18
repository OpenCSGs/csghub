package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerMcpServerRoutes(engine *gin.Engine, handlers *HandlersRegistry) {
	mcpServerHandler := handlers.RenderHandler.McpServerHandler

	engine.GET("/mcp/tools", mcpServerHandler.Tools)

	mcpRoutes := engine.Group("/mcp/servers")
	{
		mcpRoutes.GET("", mcpServerHandler.List)
		mcpRoutes.GET("/tools", mcpServerHandler.Tools)
		mcpRoutes.GET("/:namespace/:mcp_server_name", mcpServerHandler.Detail)
		mcpRoutes.GET("/:namespace/:mcp_server_name/files/:branch", mcpServerHandler.Files)
		mcpRoutes.GET("/:namespace/:mcp_server_name/blob/:branch/*path", mcpServerHandler.Blob)
		mcpRoutes.GET("/:namespace/:mcp_server_name/commits", mcpServerHandler.Commits)
		mcpRoutes.GET("/:namespace/:mcp_server_name/commit/:commit_id", mcpServerHandler.Commit)
		mcpRoutes.GET("/:namespace/:mcp_server_name/schema", mcpServerHandler.Schema)
		mcpRoutes.GET("/:namespace/:mcp_server_name/community", mcpServerHandler.Community)
	}

	authenticatedRoutes := mcpRoutes.Group("")
	authenticatedRoutes.Use(middleware.Instance.CheckCurrentUser())
	{
		authenticatedRoutes.GET("/new", mcpServerHandler.New)
		authenticatedRoutes.GET("/:namespace/:mcp_server_name/:branch/new", mcpServerHandler.NewFile)
		authenticatedRoutes.GET("/:namespace/:mcp_server_name/:branch/upload", mcpServerHandler.UploadFile)
		authenticatedRoutes.GET("/:namespace/:mcp_server_name/edit/:branch/*path", mcpServerHandler.EditFile)
		authenticatedRoutes.GET("/:namespace/:mcp_server_name/settings", mcpServerHandler.Settings)
	}
}

package routes

import "github.com/gin-gonic/gin"

func registerPromptsRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/prompts/library/:namespace/:name/:path", handlersRegistry.RenderHandler.PromptsHandler.Index)
	engine.GET("/prompts/library/:namespace/:name", handlersRegistry.RenderHandler.PromptsHandler.Index)
	engine.GET("/prompts/library", handlersRegistry.RenderHandler.PromptsHandler.Index)
	engine.GET("/prompts/optimization-assistant", handlersRegistry.RenderHandler.PromptsHandler.Assistant)
}

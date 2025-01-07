package routes

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
)

func registerEvaluationRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	evaluationRoutes := engine.Group("/evaluations")
	evaluationRoutes.Use(middleware.Instance.CheckCurrentUser())
	evaluationRoutes.GET("/new", handlersRegistry.RenderHandler.EvaluationHandler.New)
	evaluationRoutes.GET("/:id", handlersRegistry.RenderHandler.EvaluationHandler.Show)
}

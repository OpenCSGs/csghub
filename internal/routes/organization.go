package routes

import (
	"github.com/gin-gonic/gin"
)

func registerOrganizationRoutes(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	engine.GET("/organizations/:id/edit", handlersRegistry.RenderHandler.OrganizationHandler.Edit)
	engine.GET("/organizations/new", handlersRegistry.RenderHandler.OrganizationHandler.New)
	engine.GET("/organizations/:id", handlersRegistry.RenderHandler.OrganizationHandler.Show)
	engine.GET("/organizations/:id/members", handlersRegistry.RenderHandler.OrganizationHandler.Members)
}

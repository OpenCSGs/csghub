package renderHandlers

import (
	"github.com/gin-gonic/gin"
)

type OrganizationHandler interface {
	Edit(ctx *gin.Context)
	New(ctx *gin.Context)
	Show(ctx *gin.Context)
	Members(ctx *gin.Context)
}

type OrganizationHandlerImpl struct {
}

func NewOrganizationHandler() OrganizationHandler {
	return &OrganizationHandlerImpl{}
}

func (i *OrganizationHandlerImpl) Edit(ctx *gin.Context) {
	data := map[string]interface{}{
		"action": "edit",
		"name":   ctx.Param("id"),
	}
	RenderBaseInstance.RenderTemplate(ctx, "organizations_settings", data)
}

func (i *OrganizationHandlerImpl) New(ctx *gin.Context) {
	data := map[string]interface{}{}
	RenderBaseInstance.RenderTemplate(ctx, "organizations_new", data)
}

func (i *OrganizationHandlerImpl) Show(ctx *gin.Context) {
	data := map[string]interface{}{
		"name": ctx.Param("id"),
	}
	RenderBaseInstance.RenderTemplate(ctx, "organizations_show", data)
}

func (i *OrganizationHandlerImpl) Members(ctx *gin.Context) {
	data := map[string]interface{}{
		"action": "members",
		"name":   ctx.Param("id"),
	}
	RenderBaseInstance.RenderTemplate(ctx, "organizations_settings", data)
}

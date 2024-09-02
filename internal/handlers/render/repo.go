package renderHandlers

import (
	"github.com/gin-gonic/gin"
)

type BaseHandler interface {
	List(ctx *gin.Context)
	Detail(ctx *gin.Context)
	Files(ctx *gin.Context)
	Blob(ctx *gin.Context)
	Commits(ctx *gin.Context)
	Commit(ctx *gin.Context)
}

type BaseHandlerImpl struct {
	resourceType string
}

func (b *BaseHandlerImpl) List(ctx *gin.Context) {
	renderTemplate(ctx, b.resourceType+"_index", nil)
}

func (b *BaseHandlerImpl) Detail(ctx *gin.Context) {
	b.renderShow(ctx, "show", "summary")
}

func (b *BaseHandlerImpl) Files(ctx *gin.Context) {
	b.renderShow(ctx, "files", "files")
}

func (b *BaseHandlerImpl) Blob(ctx *gin.Context) {
	b.renderShow(ctx, "blob", "files")
}

func (b *BaseHandlerImpl) Commits(ctx *gin.Context) {
	b.renderShow(ctx, "commits", "files")
}

func (b *BaseHandlerImpl) Commit(ctx *gin.Context) {
	commitId := ctx.Param("commit_id")
	b.renderShow(ctx, "commit", "files", map[string]interface{}{"commitId": commitId})
}

func (b *BaseHandlerImpl) renderShow(ctx *gin.Context, actionName, defaultTab string, extraData ...map[string]interface{}) {
	data := map[string]interface{}{
		"namespace":     ctx.Param("namespace"),
		"actionName":    actionName,
		"currentPath":   ctx.Param("path"),
		"currentBranch": ctx.Param("branch"),
		"defaultTab":    defaultTab,
	}

	b.addResourceSpecificData(ctx, data)

	for _, e := range extraData {
		for k, v := range e {
			data[k] = v
		}
	}
	renderTemplate(ctx, b.resourceType+"_show", data)
}

func (b *BaseHandlerImpl) addResourceSpecificData(ctx *gin.Context, data map[string]interface{}) {
	switch b.resourceType {
	case "datasets":
		data["datasetName"] = ctx.Param("dataset_name")
	case "models":
		data["modelName"] = ctx.Param("model_name")
	case "codes":
		data["codeName"] = ctx.Param("code_name")
	case "spaces":
		data["spaceName"] = ctx.Param("space_name")
	}
}

package renderHandlers

import (
	"strings"

	"github.com/gin-gonic/gin"
)

type BaseHandler interface {
	List(ctx *gin.Context)
	Detail(ctx *gin.Context)
	Files(ctx *gin.Context)
	Blob(ctx *gin.Context)
	Commits(ctx *gin.Context)
	Commit(ctx *gin.Context)
	NewFile(ctx *gin.Context)
	UploadFile(ctx *gin.Context)
	EditFile(ctx *gin.Context)
	Settings(ctx *gin.Context)
	Billing(ctx *gin.Context)
	Logs(ctx *gin.Context)
	Community(ctx *gin.Context)
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

func (b *BaseHandlerImpl) NewFile(ctx *gin.Context) {
	b.renderShow(ctx, "new_file", "files")
}

func (b *BaseHandlerImpl) UploadFile(ctx *gin.Context) {
	b.renderShow(ctx, "upload_file", "files")
}

func (b *BaseHandlerImpl) EditFile(ctx *gin.Context) {
	b.renderShow(ctx, "edit_file", "files")
}

func (b *BaseHandlerImpl) Settings(ctx *gin.Context) {
	b.renderShow(ctx, "settings", "settings")
}

func (b *BaseHandlerImpl) Billing(ctx *gin.Context) {
	b.renderShow(ctx, "billing", "billing")
}

func (b *BaseHandlerImpl) Logs(ctx *gin.Context) {
	b.renderShow(ctx, "logs", "logs")
}

func (b *BaseHandlerImpl) Community(ctx *gin.Context) {
	b.renderShow(ctx, "community", "community")
}

func (b *BaseHandlerImpl) renderShow(ctx *gin.Context, actionName, defaultTab string, extraData ...map[string]interface{}) {
	data := map[string]interface{}{
		"namespace":     ctx.Param("namespace"),
		"actionName":    actionName,
		"currentPath":   strings.TrimPrefix(ctx.Param("path"), "/"),
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
	case "endpoints":
		data["modelName"] = ctx.Param("model_name")
		data["endpointId"] = ctx.Param("endpoint_id")
	case "finetunes":
		data["modelName"] = ctx.Param("model_name")
		data["finetuneId"] = ctx.Param("finetune_id")
		data["finetuneName"] = ctx.Param("finetune_name")
	}
}

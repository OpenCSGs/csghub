package renderHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type DatasetHandler interface {
	List(ctx *gin.Context)
	Detail(ctx *gin.Context)
	Files(ctx *gin.Context)
}

type DatasetHandlerImpl struct{}

func NewDatasetHandler() DatasetHandler {
	return &DatasetHandlerImpl{}
}

func (i *DatasetHandlerImpl) List(ctx *gin.Context) {
	ctx.HTML(http.StatusOK, "datasets_index", CreateTemplateData(ctx, nil))
}

func (i *DatasetHandlerImpl) Detail(ctx *gin.Context) {
	namespace := ctx.Param("namespace")
	datasetName := ctx.Param("dataset_name")

	ctx.HTML(http.StatusOK, "datasets_show", CreateTemplateData(ctx, map[string]interface{}{
		"namespace":   namespace,
		"datasetName": datasetName,
	}))
}

func (i *DatasetHandlerImpl) Files(ctx *gin.Context) {
	namespace := ctx.Param("namespace")
	datasetName := ctx.Param("dataset_name")
	path := ctx.Param("path")
	branch := ctx.Param("branch")

	ctx.HTML(http.StatusOK, "datasets_show", CreateTemplateData(ctx, map[string]interface{}{
		"namespace":     namespace,
		"datasetName":   datasetName,
		"currentPath":   path,
		"currentBranch": branch,
		"defaultTab":    "files",
		"actionName":    "files",
	}))
}

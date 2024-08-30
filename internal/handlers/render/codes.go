package renderHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type CodeHandler interface {
	List(ctx *gin.Context)
	Detail(ctx *gin.Context)
	Files(ctx *gin.Context)
	Blob(ctx *gin.Context)
}

type CodeHandlerImpl struct{}

func NewCodeHandler() CodeHandler {
	return &CodeHandlerImpl{}
}

func (i *CodeHandlerImpl) List(ctx *gin.Context) {
	ctx.HTML(http.StatusOK, "codes_index", CreateTemplateData(ctx, nil))
}

func (i *CodeHandlerImpl) Detail(ctx *gin.Context) {
	namespace := ctx.Param("namespace")
	codeName := ctx.Param("code_name")

	ctx.HTML(http.StatusOK, "codes_show", CreateTemplateData(ctx, map[string]interface{}{
		"namespace":  namespace,
		"codeName":   codeName,
		"defaultTab": "summary",
		"actionName": "show",
	}))
}

func (i *CodeHandlerImpl) Files(ctx *gin.Context) {
	namespace := ctx.Param("namespace")
	codeName := ctx.Param("code_name")
	path := ctx.Param("path")
	branch := ctx.Param("branch")

	ctx.HTML(http.StatusOK, "codes_show", CreateTemplateData(ctx, map[string]interface{}{
		"namespace":     namespace,
		"codeName":      codeName,
		"currentPath":   path,
		"currentBranch": branch,
		"defaultTab":    "files",
		"actionName":    "files",
	}))
}

func (i *CodeHandlerImpl) Blob(ctx *gin.Context) {
	namespace := ctx.Param("namespace")
	codeName := ctx.Param("code_name")
	path := ctx.Param("path")
	branch := ctx.Param("branch")

	ctx.HTML(http.StatusOK, "codes_show", CreateTemplateData(ctx, map[string]interface{}{
		"namespace":     namespace,
		"codeName":      codeName,
		"currentPath":   path,
		"currentBranch": branch,
		"defaultTab":    "files",
		"actionName":    "blob",
	}))
}

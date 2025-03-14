package renderHandlers

import (
	"github.com/gin-gonic/gin"
)

type ErrorHandler interface {
	NotFound(ctx *gin.Context)
	Unauthorized(ctx *gin.Context)
	LoginFailed(ctx *gin.Context)
	ServerError(ctx *gin.Context)
}

type ErrorHandlerImpl struct {
}

func NewErrorHandler() ErrorHandler {
	return &ErrorHandlerImpl{}
}

func (e *ErrorHandlerImpl) NotFound(ctx *gin.Context) {
	RenderBaseInstance.RenderTemplate(ctx, "errors_404", nil)
}

func (e *ErrorHandlerImpl) Unauthorized(ctx *gin.Context) {
	RenderBaseInstance.RenderTemplate(ctx, "errors_401", nil)
}

func (e *ErrorHandlerImpl) LoginFailed(ctx *gin.Context) {
	RenderBaseInstance.RenderTemplate(ctx, "errors_login_failed", nil)
}

func (e *ErrorHandlerImpl) ServerError(ctx *gin.Context) {
	RenderBaseInstance.RenderTemplate(ctx, "errors_server_error", nil)
}

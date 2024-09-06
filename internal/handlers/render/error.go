package renderHandlers

import (
	"github.com/gin-gonic/gin"
)

type ErrorHandler interface {
	NotFound(ctx *gin.Context)
	Unauthorized(ctx *gin.Context)
	LoginFailed(ctx *gin.Context)
}

type ErrorHandlerImpl struct {
}

func NewErrorHandler() ErrorHandler {
	return &ErrorHandlerImpl{}
}

func (e *ErrorHandlerImpl) NotFound(ctx *gin.Context) {
	renderTemplate(ctx, "errors_404", nil)
}

func (e *ErrorHandlerImpl) Unauthorized(ctx *gin.Context) {
	renderTemplate(ctx, "errors_401", nil)
}

func (e *ErrorHandlerImpl) LoginFailed(ctx *gin.Context) {
	renderTemplate(ctx, "errors_login_failed", nil)
}

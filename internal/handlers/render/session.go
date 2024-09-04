package renderHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/config"
)

type SessionHandler interface {
	Login(ctx *gin.Context)
	SignUp(ctx *gin.Context)
	Logout(ctx *gin.Context)
}

type SessionHandlerImpl struct{}

func NewSessionHandler() SessionHandler {
	return &SessionHandlerImpl{}
}

func (i *SessionHandlerImpl) Login(ctx *gin.Context) {
	ctx.Redirect(http.StatusFound, config.Env("SIGNUP_URL", "").(string))
}

func (i *SessionHandlerImpl) SignUp(ctx *gin.Context) {
	ctx.Redirect(http.StatusFound, config.Env("LOGIN_URL", "").(string))
}

func (i *SessionHandlerImpl) Logout(ctx *gin.Context) {
	ctx.Redirect(http.StatusFound, "/")
}

func (i *SessionHandlerImpl) Create(ctx *gin.Context) {
}

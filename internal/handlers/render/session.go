package renderHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/config"
)

type SessionHandler interface {
	Login(ctx *gin.Context)
	SignUp(ctx *gin.Context)
	Logout(ctx *gin.Context)
}

type SessionHandlerImpl struct {
	Config *config.Config
}

func NewSessionHandler(config *config.Config) SessionHandler {
	return &SessionHandlerImpl{
		Config: config,
	}
}

func (i *SessionHandlerImpl) Login(ctx *gin.Context) {
	ctx.Redirect(http.StatusFound, i.Config.SignupURL)
}

func (i *SessionHandlerImpl) SignUp(ctx *gin.Context) {
	ctx.Redirect(http.StatusFound, i.Config.LoginURL)
}

func (i *SessionHandlerImpl) Logout(ctx *gin.Context) {
	ctx.Redirect(http.StatusFound, "/")
}

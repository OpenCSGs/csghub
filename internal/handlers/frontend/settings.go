package frontendHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/svc"
	"opencsg.com/portal/pkg/enum"
)

type SettingsHandler interface {
	SetLocale(ctx *gin.Context)
}

type SettingsHandlerImpl struct {
	svcCtx *svc.ServiceContext
}

func NewSettingsHandler(svcCtx *svc.ServiceContext) SettingsHandler {
	return &SettingsHandlerImpl{
		svcCtx: svcCtx,
	}
}

func (i *SettingsHandlerImpl) SetLocale(ctx *gin.Context) {
	configureLocale(ctx)
	ctx.Redirect(http.StatusFound, ctx.Request.Referer())
}

func configureLocale(ctx *gin.Context) {
	locale := getLocale(ctx)
	setLocaleCookie(ctx, locale)
}

func getLocale(ctx *gin.Context) string {
	// 查询参数
	if locale := ctx.Param(enum.LocaleQueryKey); locale != "" {
		return locale
	}

	return enum.DefaultLocale
}

func setLocaleCookie(ctx *gin.Context, locale string) {
	ctx.SetCookie(enum.LocaleCookieKey, locale, 3600*24*30, "/", "", false, false)
	ctx.Set(enum.LocaleCookieKey, locale)
}

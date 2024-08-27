package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

const (
	defaultLocale   = "zh"
	englishLocale   = "en"
	localeCookieKey = "locale"
	localeQueryKey  = "locale"
)

func SetLocale(c *gin.Context) {
	configureLocale(c)
	c.Redirect(http.StatusFound, c.Request.Referer())
}

func configureLocale(c *gin.Context) {
	locale := getLocale(c)
	setLocaleCookie(c, locale)
	c.Next()
}

func getLocale(c *gin.Context) string {
	// 查询参数
	if locale := c.Param(localeQueryKey); locale != "" {
		return locale
	}

	return defaultLocale
}

func setLocaleCookie(c *gin.Context, locale string) {
	c.SetCookie(localeCookieKey, locale, 3600*24*30, "/", "", false, false)
	c.Set(localeCookieKey, locale)
}

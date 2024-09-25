package middleware

import (
	"log/slog"
	"time"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/pkg/utils/jwt"
)

func Log() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if ctx.Request.Method == "OPTIONS" || ctx.Request.Method == "HEAD" {
			ctx.Next()
			return
		}

		startTime := time.Now()

		ctx.Next()
		var username string
		user := jwt.GetCurrentUser(ctx)
		if user != nil {
			username = user.Name
		}

		latency := time.Since(startTime).Milliseconds()
		slog.InfoContext(ctx, "http request", slog.String("ip", ctx.ClientIP()),
			slog.String("method", ctx.Request.Method),
			slog.Int("latency(ms)", int(latency)),
			slog.Int("status", ctx.Writer.Status()),
			slog.String("current_user", username),
			slog.String("url", ctx.Request.URL.RequestURI()),
		)
	}
}

package frontendHandlers

import (
	"time"

	"github.com/gin-gonic/gin"
)

type PingHandler interface {
	Ping(c *gin.Context)
}

type PingHandlerImpl struct{}

func NewPingHandler() PingHandler {
	return &PingHandlerImpl{}
}

func (i *PingHandlerImpl) Ping(c *gin.Context) {
	data := make(map[string]string, 3)
	data["message"] = "pong"
	data["status"] = "ok"
	data["time"] = time.Now().Format(time.DateTime)

	c.JSON(200, data)
}

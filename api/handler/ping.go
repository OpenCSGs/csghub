package handler

import (
	"time"

	"github.com/gin-gonic/gin"
)

func Ping(c *gin.Context) {
	data := make(map[string]string, 3)
	data["message"] = "pong"
	data["status"] = "ok"
	data["time"] = time.Now().Format(time.DateTime)

	c.JSON(200, data)
}

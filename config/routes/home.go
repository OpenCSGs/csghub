package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func registerHomeRoutes(engine *gin.Engine) {
	engine.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "models_index", createTemplateData(c, nil))
	})
}

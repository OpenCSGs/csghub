package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func registerSpaceRoutes(engine *gin.Engine) {
	engine.GET("/spaces", func(c *gin.Context) {
		c.HTML(http.StatusOK, "spaces_index", createTemplateData(c, nil))
	})

	engine.GET("/spaces/:namespace/:space_name", func(c *gin.Context) {
		namespace := c.Param("namespace")
		spaceName := c.Param("space_name")

		c.HTML(http.StatusOK, "spaces_show", createTemplateData(c, map[string]interface{}{
			"namespace": namespace,
			"spaceName": spaceName,
		}))
	})
}

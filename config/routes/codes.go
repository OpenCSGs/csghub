package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func registerCodeRoutes(engine *gin.Engine) {
	engine.GET("/codes", func(c *gin.Context) {
		c.HTML(http.StatusOK, "codes_index", createTemplateData(c, nil))
	})

	engine.GET("/codes/:namespace/:code_name", func(c *gin.Context) {
		namespace := c.Param("namespace")
		codeName := c.Param("code_name")

		c.HTML(http.StatusOK, "codes_show", createTemplateData(c, map[string]interface{}{
			"namespace": namespace,
			"codeName":  codeName,
		}))
	})
}

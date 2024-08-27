package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func registerModelRoutes(engine *gin.Engine) {
	engine.GET("/models", func(c *gin.Context) {
		c.HTML(http.StatusOK, "models_index", createTemplateData(c, nil))
	})

	engine.GET("/models/:namespace/:model_name", func(c *gin.Context) {
		namespace := c.Param("namespace")
		modelName := c.Param("model_name")

		c.HTML(http.StatusOK, "models_show", createTemplateData(c, map[string]interface{}{
			"namespace": namespace,
			"modelName": modelName,
		}))
	})
}

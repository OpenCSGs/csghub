package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func registerDatasetRoutes(engine *gin.Engine) {
	engine.GET("/datasets", func(c *gin.Context) {
		c.HTML(http.StatusOK, "datasets_index", createTemplateData(c, nil))
	})

	engine.GET("/datasets/:namespace/:dataset_name", func(c *gin.Context) {
		namespace := c.Param("namespace")
		datasetName := c.Param("dataset_name")

		c.HTML(http.StatusOK, "datasets_show", createTemplateData(c, map[string]interface{}{
			"namespace":   namespace,
			"datasetName": datasetName,
		}))
	})
}

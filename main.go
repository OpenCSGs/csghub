package main

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/config/routes"

	"opencsg.com/portal/config"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	config.InitConfig("env")
	engine := routes.Initialize()

	engine.Run(":8090")
}

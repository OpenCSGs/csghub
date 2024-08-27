package main

import (
	"github.com/gin-gonic/gin"

	"opencsg.com/portal/config"
	"opencsg.com/portal/config/routes"
	"opencsg.com/portal/store/database"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	config.InitConfig("env")

	dbConfig := database.DBConfig{
		Dialect: database.DatabaseDialect(config.Env("DB_DIALECT", "pg").(string)),
		DSN:     config.Env("DB_DSN", "postgresql://postgres:postgres@localhost:5432/csghub_development?sslmode=disable").(string),
	}
	database.InitDB(dbConfig)

	engine := routes.Initialize()

	engine.Run(":8090")
}

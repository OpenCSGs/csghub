package main

import (
	"github.com/gin-gonic/gin"

	"opencsg.com/portal/internal/config"
	"opencsg.com/portal/internal/routes"
	"opencsg.com/portal/internal/svc"
	"opencsg.com/portal/pkg/database"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	config.InitConfig("env")

	// load env
	cfg := &config.Config{
		DbConfig: database.DBConfig{
			Dialect: database.DatabaseDialect(config.Env("DB_DIALECT", "pg").(string)),
			DSN:     config.Env("DB_DSN", "postgresql://postgres:postgres@localhost:5432/csghub_development?sslmode=disable").(string),
		},
	}

	svcCtx := svc.NewServiceContext(cfg)

	engine := routes.Initialize(svcCtx)

	engine.Run(":8090")
}

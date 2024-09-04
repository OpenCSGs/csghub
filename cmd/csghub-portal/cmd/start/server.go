package start

import (
	"github.com/gin-gonic/gin"
	"github.com/spf13/cobra"
	"opencsg.com/portal/internal/config"
	"opencsg.com/portal/internal/routes"
	"opencsg.com/portal/internal/svc"
	"opencsg.com/portal/pkg/database"
)

var serverCmd = &cobra.Command{
	Use:   "server",
	Short: "start a server",
	RunE: func(cmd *cobra.Command, args []string) error {
		gin.SetMode(gin.ReleaseMode)
		config.InitConfig("../../../../.env")

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

		return nil
	},
}

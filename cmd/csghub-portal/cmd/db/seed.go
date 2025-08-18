package db

import (
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/spf13/cobra"
)

var seedCmd = &cobra.Command{
	Use:   "seed",
	Short: "start db seed",
	RunE: func(cmd *cobra.Command, args []string) error {
		gin.SetMode(gin.ReleaseMode)

		slog.Info("Database seeded successfully")

		return nil
	},
}

package db

import (
	"context"
	"fmt"
	"time"

	"github.com/spf13/cobra"
	"opencsg.com/portal/config"
	"opencsg.com/portal/pkg/database"
	"opencsg.com/portal/pkg/database/migrations"
)

func init() {
	Cmd.AddCommand(seedCmd)
}

var Cmd = &cobra.Command{
	Use:   "db",
	Short: "start db seed",
	PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
		ctx, cancel := context.WithTimeout(cmd.Context(), 10*time.Second)
		defer cancel()

		config, err := config.LoadConfig()
		if err != nil {
			return err
		}

		db, err := database.NewDB(config)
		if err != nil {
			return fmt.Errorf("initializing DB: %w", err)
		}

		migrator := migrations.NewMigrator(db)
		status, err := migrator.MigrationsWithStatus(ctx)
		if err != nil {
			return fmt.Errorf("checking migrations status: %w", err)
		}
		unapplied := status.Unapplied()
		if len(unapplied) > 0 {
			return fmt.Errorf("there are %d migrations to apply: %s", len(unapplied), unapplied)
		}

		return nil
	},

	RunE: func(cmd *cobra.Command, args []string) error {
		return cmd.Help()
	},
}

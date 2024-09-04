package migration

import (
	"fmt"
	"log/slog"
	"os"
	"strings"

	"github.com/spf13/cobra"
	"github.com/uptrace/bun/migrate"
	"opencsg.com/portal/config"
	"opencsg.com/portal/pkg/database"
	"opencsg.com/portal/pkg/database/migrations"
)

// verboseMode whether to show SQL detail
var verboseMode bool

func init() {
	Cmd.Flags().BoolVar(&verboseMode, "verbose", false, "whether to show SQL detail")
	Cmd.AddCommand(
		initCmd,
		migrateCmd,
		rollbackCmd,
		lockCmd,
		unlockCmd,
		createGoCmd,
		createSQLCmd,
		statusCmd,
		markAppliedCmd,
	)
}

var (
	migrator *migrate.Migrator
	db       *database.DB
)

var Cmd = &cobra.Command{
	Use:   "migration",
	Short: "run database migrations",
	Long:  "migration manage database schema, keeping it up-to-date with current application logic. Developer also uses migration to create new database migration during their development.",
	PersistentPreRunE: func(cmd *cobra.Command, args []string) (err error) {
		if verboseMode {
			err = os.Setenv("DB_DEBUG", "1")
			if err != nil {
				err = fmt.Errorf("setting ENV DB_DEBUG: %w", err)
				return
			}
		}

		config, err := config.LoadConfig()
		if err != nil {
			return err
		}

		db, err := database.NewDB(config)
		if err != nil {
			err = fmt.Errorf("initializing DB connection: %w", err)
			return
		}
		migrator = migrations.NewMigrator(db)

		return
	},
	Run: func(cmd *cobra.Command, args []string) {
		_ = cmd.Help()
	},
	PersistentPostRun: func(cmd *cobra.Command, args []string) {
		if db != nil {
			_ = db.Close()
		}
	},
}

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "create migration tables",
	RunE: func(cmd *cobra.Command, args []string) error {
		return migrator.Init(cmd.Context())
	},
}

var migrateCmd = &cobra.Command{
	Use:   "migrate",
	Short: "migrate database",
	RunE: func(cmd *cobra.Command, args []string) error {
		group, err := migrator.Migrate(cmd.Context())
		if err != nil {
			return err
		}
		if group.IsZero() {
			slog.Info("there are no new migrations to run (database is up to date)")
			return nil
		}
		slog.Info(fmt.Sprintf("migrated to %s", group))
		return nil
	},
}

var rollbackCmd = &cobra.Command{
	Use:   "rollback",
	Short: "rollback the last migration group",
	RunE: func(cmd *cobra.Command, args []string) error {
		group, err := migrator.Rollback(cmd.Context())
		if err != nil {
			return err
		}
		if group.IsZero() {
			slog.Info("there are no groups to roll back")
			return nil
		}
		slog.Info(fmt.Sprintf("rolled back %s", group))
		return nil
	},
}

var lockCmd = &cobra.Command{
	Use:   "lock",
	Short: "lock migrations",
	RunE: func(cmd *cobra.Command, args []string) error {
		return migrator.Lock(cmd.Context())
	},
}

var unlockCmd = &cobra.Command{
	Use:   "unlock",
	Short: "unlock migrations",
	RunE: func(cmd *cobra.Command, args []string) error {
		return migrator.Unlock(cmd.Context())
	},
}

var createGoCmd = &cobra.Command{
	Use:   "create_go",
	Short: "create Go migration for developers",
	RunE: func(cmd *cobra.Command, args []string) error {
		name := strings.Join(args, "_")
		mf, err := migrator.CreateGoMigration(cmd.Context(), name)
		if err != nil {
			return err
		}
		slog.Info("created migration %s (%s)", mf.Name, mf.Path)
		return nil
	},
}

var createSQLCmd = &cobra.Command{
	Use:   "create_sql",
	Short: "create up and down SQL migrations for developers",
	RunE: func(cmd *cobra.Command, args []string) error {
		name := strings.Join(args, "_")
		files, err := migrator.CreateSQLMigrations(cmd.Context(), name)
		if err != nil {
			return err
		}

		for _, mf := range files {
			slog.Info("created migration %s (%s)", mf.Name, mf.Path)
		}

		return nil
	},
}

var statusCmd = &cobra.Command{
	Use:   "status",
	Short: "print migrations status",
	RunE: func(cmd *cobra.Command, args []string) error {
		ms, err := migrator.MigrationsWithStatus(cmd.Context())
		if err != nil {
			return err
		}
		slog.Info(fmt.Sprintf("migrations: %s", ms))
		slog.Info(fmt.Sprintf("unapplied migrations: %s", ms.Unapplied()))
		slog.Info(fmt.Sprintf("last migration group: %s", ms.LastGroup()))
		return nil
	},
}

var markAppliedCmd = &cobra.Command{
	Use:   "mark_applied",
	Short: "mark migrations as applied without actually running them",
	RunE: func(cmd *cobra.Command, args []string) error {
		group, err := migrator.Migrate(cmd.Context(), migrate.WithNopMigration())
		if err != nil {
			return err
		}
		if group.IsZero() {
			slog.Info("there are no new migrations to mark as applied")
			return nil
		}
		slog.Info(fmt.Sprintf("marked as applied %s", group))
		return nil
	},
}

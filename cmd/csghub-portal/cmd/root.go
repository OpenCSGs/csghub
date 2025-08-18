package cmd

import (
	"fmt"
	"log/slog"
	"os"

	"github.com/spf13/cobra"
	"opencsg.com/portal/cmd/csghub-portal/cmd/db"
	"opencsg.com/portal/cmd/csghub-portal/cmd/migration"
	"opencsg.com/portal/cmd/csghub-portal/cmd/start"
)

var (
	logLevel  string
	logFormat string
)

var RootCmd = &cobra.Command{
	Use:          "csghub-portal",
	Short:        "csghub-portal command line tool",
	SilenceUsage: true,
}

func init() {
	var err error
	defer func() {
		if err != nil {
			panic(err)
		}
	}()

	RootCmd.PersistentFlags().StringVarP(&logLevel, "log-level", "l", "info", "set log level to debug, info, warn, error or fatal (case-insensitive). default is INFO")
	RootCmd.PersistentFlags().StringVarP(&logFormat, "log-format", "f", "json", "set log format to json or text. default is json")
	RootCmd.DisableAutoGenTag = true

	cobra.OnInitialize(func() {
		setupLog(logLevel, logFormat)
	})

	RootCmd.AddCommand(
		migration.Cmd,
		start.Cmd,
		db.Cmd,
	)
}

func setupLog(lvl, format string) {
	logLevel := slog.LevelInfo.Level()
	var logger *slog.Logger
	if len(lvl) > 0 {
		err := logLevel.UnmarshalText([]byte(lvl))
		// logLevel not change if unmarshall failed
		if err != nil {
			fmt.Println("input invalid log level, use default log level INFO")
		}
	}
	// TODO:log source file position
	opt := &slog.HandlerOptions{AddSource: false, Level: logLevel}
	var handler slog.Handler
	switch format {
	case "json":
		handler = slog.NewJSONHandler(os.Stdout, opt)
	default:
		handler = slog.NewTextHandler(os.Stdout, opt)
	}
	fmt.Printf("init logger, level: %s, format: %s\n", logLevel.String(), format)
	logger = slog.New(handler)
	slog.SetDefault(logger)
}

package main

import (
	"context"
	"os"

	"opencsg.com/portal/cmd/csghub-portal/cmd"
)

func main() {
	command := cmd.RootCmd
	if err := command.ExecuteContext(context.Background()); err != nil {
		os.Exit(1)
	}
}

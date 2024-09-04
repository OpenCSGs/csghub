package server

import (
	"context"

	"opencsg.com/portal/config"
	"opencsg.com/portal/pkg/server/csghubserver"
)

func NewServer(config *config.Config) (Server, error) {
	server, err := csghubserver.NewCsgHubServer(
		context.Background(),
		config.StarhubServer.BaseURL,
		config.StarhubServer.APIKey,
	)
	if err != nil {
		return nil, err
	}
	return server, nil
}

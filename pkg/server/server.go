package server

import (
	"context"

	"opencsg.com/portal/config"
	"opencsg.com/portal/pkg/server/backend"
	"opencsg.com/portal/pkg/server/backend/csghubserver"
)

func NewServer(config *config.Config) (backend.Server, error) {
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

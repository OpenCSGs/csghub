package svc

import (
	"opencsg.com/portal/config"
	"opencsg.com/portal/pkg/database"
)

type ServiceContext struct {
	Db *database.DB
	// redis
	// mq
	// async
	// worker
	// other service will be added here
	Config *config.Config
}

func NewServiceContext(cfg *config.Config) (*ServiceContext, error) {
	db, err := database.NewDB(cfg)
	if err != nil {
		return nil, err
	}

	return &ServiceContext{
		Db:     db,
		Config: cfg,
	}, nil
}

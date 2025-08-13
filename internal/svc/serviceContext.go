package svc

import (
	"opencsg.com/portal/config"
)

type ServiceContext struct {
	// redis
	// mq
	// async
	// worker
	// other service will be added here
	Config *config.Config
}

func NewServiceContext(cfg *config.Config) (*ServiceContext, error) {
	return &ServiceContext{
		Config: cfg,
	}, nil
}

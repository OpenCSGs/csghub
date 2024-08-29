package svc

import (
	"opencsg.com/portal/internal/config"
	"opencsg.com/portal/pkg/database"
)

type ServiceContext struct {
	Db *database.DB
	// redis
	// mq
	// async
	// worker
	// other service will be added here
}

func NewServiceContext(cfg *config.Config) *ServiceContext {
	db, err := database.NewDB(cfg.DbConfig)
	if err != nil {
		panic(err)
	}

	return &ServiceContext{
		Db: db,
	}
}

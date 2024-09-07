package models

import (
	"context"
	"time"

	"github.com/uptrace/bun"
	"github.com/uptrace/bun/schema"
	"opencsg.com/portal/config"
	"opencsg.com/portal/pkg/database"
)

var defaultDB *database.DB

func InitDB(config *config.Config) error {
	db, err := database.NewDB(config)
	if err != nil {
		return err
	}
	defaultDB = db
	return nil
}

type times struct {
	CreatedAt time.Time `bun:",nullzero,notnull,skipupdate,default:current_timestamp" json:"created_at"`
	UpdatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp" json:"updated_at"`
}

func (t *times) BeforeAppendModel(ctx context.Context, query schema.Query) error {
	switch query.(type) {
	case *bun.UpdateQuery:
		//q := query.(*bun.UpdateQuery)
		//m := q.GetModel().Value()
		//skip update for Repository, and related assets
		// if _, ok := m.(*Repository); ok {
		// 	return nil
		// }
		// if _, ok := m.(*Model); ok {
		// 	return nil
		// }
		// if _, ok := m.(*Dataset); ok {
		// 	return nil
		// }
		// if _, ok := m.(*Code); ok {
		// 	return nil
		// }
		// if _, ok := m.(*Space); ok {
		// 	return nil
		// }
		t.UpdatedAt = time.Now()
	}

	return nil
}

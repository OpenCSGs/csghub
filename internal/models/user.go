package models

import (
	"context"

	"opencsg.com/portal/pkg/database"
)

type UserStore struct {
	db *database.DB
}

func NewUserStore(db *database.DB) *UserStore {
	return &UserStore{
		db: db,
	}
}

type User struct {
	ID            int64  `bun:",pk,autoincrement" json:"id"`
	Nickname      string `bun:"column:nickname,notnull" json:"nickname"`
	Name          string `bun:"column:name,notnull,unique" json:"name"`
	Email         string `bun:"column:email,notnull,unique" json:"email"`
	LoginIdentity string `bun:"column:login_identity,notnull" json:"login_identity"`
	Gender        string `bun:"," json:"gender"`
	RolesMask     string `bun:"," json:"roles_mask"`
	Phone         string `bun:"," json:"phone"`

	times
}

func (s *UserStore) FindByLoginIdentity(ctx context.Context, login_identity string) (user User, err error) {
	err = s.db.Operator.Core.NewSelect().Model(&user).Where("login_identity = ?", login_identity).Scan(ctx)
	return
}

func (s *UserStore) IsExist(ctx context.Context, username string) (exists bool, err error) {
	return s.db.Operator.Core.
		NewSelect().
		Model((*User)(nil)).
		Where("name = ?", username).
		Exists(ctx)
}

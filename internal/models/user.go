package models

import (
	"context"
	"strings"

	"opencsg.com/portal/pkg/database"
)

type UserStore struct {
	db *database.DB
}

func NewUserStore() *UserStore {
	return &UserStore{
		db: defaultDB,
	}
}

type User struct {
	ID            int64  `bun:",pk,autoincrement" json:"id"`
	Nickname      string `bun:",notnull" json:"nickname"`
	Name          string `bun:",notnull,unique" json:"name"`
	Email         string `bun:",notnull,unique" json:"email"`
	LoginIdentity string `bun:",pk,notnull" json:"login_identity"`
	Gender        string `bun:"," json:"gender"`
	RolesMask     string `bun:"," json:"roles_mask"`
	Phone         string `bun:"," json:"phone"`
	SessionIP     string `bun:"," json:"session_ip"`

	times
}

func (u *User) IsAdmin() bool {
	return strings.Contains(u.RolesMask, "admin") || strings.Contains(u.RolesMask, "super_user")
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

func (s *UserStore) Create(ctx context.Context, user *User) (err error) {
	err = s.db.Operator.Core.NewInsert().Model(user).Scan(ctx, user)
	return
}

func (s *UserStore) Update(ctx context.Context, user *User) (err error) {
	_, err = s.db.Operator.Core.NewUpdate().Model(user).WherePK().Exec(ctx)
	return
}

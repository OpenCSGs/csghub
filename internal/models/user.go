package models

import (
	"context"

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
	Nickname      string `bun:"," json:"nickname"`
	Name          string `bun:"," json:"name"`
	Email         string `bun:"," json:"email"`
	LoginIdentity string `bun:",pk,notnull" json:"login_identity"`
	Gender        string `bun:"," json:"gender"`
	RolesMask     int    `bun:"," json:"roles_mask"`
	Phone         string `bun:"," json:"phone"`
	SessionIP     string `bun:"," json:"session_ip"`

	times
}

const (
	RoleSuperUser    = 1 << iota // 1
	RoleAdmin                    // 2
	RolePersonalUser             // 4
	RoleCompanyUser              // 8
)

func (u *User) Roles() []string {
	var roles []string
	if u.RolesMask&RoleSuperUser != 0 {
		roles = append(roles, "super_user")
	}
	if u.RolesMask&RoleAdmin != 0 {
		roles = append(roles, "admin")
	}
	if u.RolesMask&RolePersonalUser != 0 {
		roles = append(roles, "personal_user")
	}
	if u.RolesMask&RoleCompanyUser != 0 {
		roles = append(roles, "company_user")
	}
	return roles
}

func (u *User) HasRole(role string) bool {
	switch role {
	case "super_user":
		return u.RolesMask&RoleSuperUser != 0
	case "admin":
		return u.RolesMask&RoleAdmin != 0
	case "personal_user":
		return u.RolesMask&RolePersonalUser != 0
	case "company_user":
		return u.RolesMask&RoleCompanyUser != 0
	default:
		return false
	}
}

func (u *User) IsAdmin() bool {
	return u.HasRole("admin") || u.HasRole("super_user")
}

func (u *User) IsSuperUser() bool {
	return u.HasRole("super_user")
}

func (u *User) SetRoles(roles ...string) {
	u.RolesMask = 0
	for _, role := range roles {
		switch role {
		case "super_user":
			u.RolesMask |= RoleSuperUser
		case "admin":
			u.RolesMask |= RoleAdmin
		case "personal_user":
			u.RolesMask |= RolePersonalUser
		case "company_user":
			u.RolesMask |= RoleCompanyUser
		}
	}
}

func (s *UserStore) FindByLoginIdentity(ctx context.Context, login_identity string) (user User, err error) {
	err = s.db.Operator.Core.NewSelect().Model(&user).Where("login_identity = ?", login_identity).Scan(ctx, &user)
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

func (s *UserStore) FindyByName(ctx context.Context, name string) (user User, err error) {
	err = s.db.Operator.Core.NewSelect().Model(&user).Where("name = ?", name).Scan(ctx, &user)
	return
}

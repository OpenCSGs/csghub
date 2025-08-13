package migrations

import (
	"context"

	"github.com/uptrace/bun"
)

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
	Avatar        string `bun:"," json:"avatar"`

	times
}

type AdminPhoto struct {
	ID     int64  `bun:",pk,autoincrement" json:"id"`
	UserID int64  `bun:"," json:"user_id"`
	Title  string `bun:"," json:"title"`
	URL    string `bun:"," json:"url"`
	User   User   `bun:"rel:belongs-to,join:user_id=id" json:"user"`

	times
}

var baseModel = []any{
	&User{},
	&AdminPhoto{},
}

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		err := createTables(ctx, db, baseModel...)
		if err != nil {
			return err
		}
		_, err = db.NewCreateIndex().
			Model((*AdminPhoto)(nil)).
			Index("index_admin_photos_on_user_id").
			Column("user_id").
			Exec(ctx)
		return err
	}, func(ctx context.Context, db *bun.DB) error {
		return dropTables(ctx, db, baseModel...)
	})
}

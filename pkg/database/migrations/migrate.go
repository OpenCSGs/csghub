// Package migrations supports database migration.
// Mind it can not depend on model package,
// as it's the latter's dependency.
package migrations

import (
	"context"
	"database/sql"
	"embed"
	"fmt"
	"reflect"
	"time"

	"github.com/uptrace/bun"
	"opencsg.com/portal/pkg/database"

	"github.com/uptrace/bun/migrate"
)

//go:embed *.sql
var migrationDir embed.FS

var Migrations = migrate.NewMigrations()

func init() {
	if err := Migrations.Discover(migrationDir); err != nil {
		err = fmt.Errorf("discovering database migrations: %w", err)
		panic(err)
	}
}

// NewMigrator factory of database migrator
func NewMigrator(db *database.DB) *migrate.Migrator {
	return migrate.NewMigrator(db.BunDB, Migrations) // nolint: staticcheck
}

func createTables(ctx context.Context, db *bun.DB, tables ...any) (err error) {
	err = db.RunInTx(ctx, &sql.TxOptions{}, func(ctx context.Context, tx bun.Tx) (err error) {
		for _, table := range tables {
			tableType := reflect.TypeOf(table)
			if tableType.Kind() == reflect.Pointer {
				tableType = tableType.Elem()
			}
			if tableType.Kind() != reflect.Struct {
				err = fmt.Errorf("input %T is of kind %s, want struct", table, tableType.Kind().String())
				return
			}

			_, err = tx.NewCreateTable().
				Model(reflect.New(tableType).Interface()).
				Exec(ctx)
			if err != nil {
				err = fmt.Errorf("creating table for %T: %w", table, err)
				return
			}
		}

		return
	})

	return
}

func dropTables(ctx context.Context, db *bun.DB, tables ...any) (err error) {
	err = db.RunInTx(ctx, &sql.TxOptions{}, func(ctx context.Context, tx bun.Tx) (err error) {
		for _, table := range tables {
			tableType := reflect.TypeOf(table)
			if tableType.Kind() == reflect.Pointer {
				tableType = tableType.Elem()
			}
			if tableType.Kind() != reflect.Struct {
				err = fmt.Errorf("input %T is of kind %s, want struct", table, tableType.Kind().String())
				return
			}

			_, err = tx.NewDropTable().
				Model(reflect.New(tableType).Interface()).
				IfExists().
				Cascade().
				Exec(ctx)
			if err != nil {
				err = fmt.Errorf("creating table for %T: %w", table, err)
				return
			}
		}

		return
	})

	return
}

// times has now as its default on inserting.
// Updating operations must take care of UpdatedAt by themselves.
// CreatedAt will not be updated thanks to skipupdate field tag,
// ref: https://github.com/uptrace/bun/pull/565
// Sadly, bun.BeforeAppendModelHook does not actually work,
// see https://github.com/uptrace/bun/discussions/621
type times struct {
	CreatedAt time.Time `bun:",nullzero,notnull,skipupdate,default:current_timestamp" json:"created_at"`
	UpdatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp" json:"updated_at"`
}

// OwnerType is the owner a user or organization?
type OwnerType string

// OwnerRef tracks resource owner from User or Organization
type OwnerRef struct {
	//  is the owner a user or organization?
	OwnerType OwnerType `bun:",nullzero,notnull" json:"ownerType"`
	// foreigner key to User / Organization
	OwnerID int `bun:",nullzero,notnull" json:"ownerId"`
}

# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_10_26_064610) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "comments", force: :cascade do |t|
    t.text "content"
    t.string "commentable_type", null: false
    t.bigint "commentable_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["commentable_type", "commentable_id"], name: "index_comments_on_commentable"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "landing_pages", force: :cascade do |t|
    t.string "lead_source"
    t.string "channel"
    t.string "lead_status"
    t.string "local_channel"
    t.string "lead_type"
    t.string "lead_fields"
    t.string "uuid"
    t.string "landing_page_status", default: "active"
    t.string "title"
    t.string "internal_title"
    t.text "description"
    t.string "custom_required_fields"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "spaces", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "space_starchain_id"
    t.string "title"
    t.text "desc"
    t.string "site_link"
    t.integer "space_type"
    t.integer "status", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "cover_image"
    t.index ["user_id"], name: "index_spaces_on_user_id"
  end

  create_table "taggings", force: :cascade do |t|
    t.bigint "tag_id", null: false
    t.bigint "space_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["space_id"], name: "index_taggings_on_space_id"
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name"
    t.string "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "login_identity"
    t.string "name"
    t.string "gender"
    t.integer "roles_mask"
    t.string "phone"
    t.boolean "phone_verified"
    t.string "email"
    t.boolean "email_verified"
    t.datetime "last_login_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "avatar"
    t.boolean "company_verified", default: false
    t.index ["login_identity"], name: "index_users_on_login_identity", unique: true
  end

  add_foreign_key "comments", "users"
  add_foreign_key "taggings", "spaces"
  add_foreign_key "taggings", "tags"
end

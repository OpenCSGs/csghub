class CreateTables < ActiveRecord::Migration[7.0]
  def change
    create_table "action_text_rich_texts", force: :cascade do |t|
      t.string "name", null: false
      t.text "body"
      t.string "record_type", null: false
      t.bigint "record_id", null: false
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.index ["record_type", "record_id", "name"], name: "index_action_text_rich_texts_uniqueness", unique: true
    end

    create_table "active_storage_attachments", force: :cascade do |t|
      t.string "name", null: false
      t.string "record_type", null: false
      t.bigint "record_id", null: false
      t.bigint "blob_id", null: false
      t.datetime "created_at", null: false
      t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
      t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
    end

    create_table "active_storage_blobs", force: :cascade do |t|
      t.string "key", null: false
      t.string "filename", null: false
      t.string "content_type"
      t.text "metadata"
      t.string "service_name", null: false
      t.bigint "byte_size", null: false
      t.string "checksum"
      t.datetime "created_at", null: false
      t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
    end

    create_table "active_storage_variant_records", force: :cascade do |t|
      t.bigint "blob_id", null: false
      t.string "variation_digest", null: false
      t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
    end

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

    create_table "datasets", force: :cascade do |t|
      t.string "name"
      t.string "license"
      t.string "visibility"
      t.string "owner_type", null: false
      t.bigint "owner_id", null: false
      t.bigint "creator_id"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.index ["creator_id"], name: "index_datasets_on_creator_id"
      t.index ["owner_type", "owner_id"], name: "index_datasets_on_owner"
    end

    create_table "discussions", force: :cascade do |t|
      t.bigint "user_id", null: false
      t.string "title", null: false
      t.bigint "discussionable_id", null: false
      t.string "discussionable_type", null: false
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
    end

    create_table "error_logs", force: :cascade do |t|
      t.string "request"
      t.text "payload"
      t.string "user_info"
      t.string "message"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.text "backtrace"
    end

    create_table "models", force: :cascade do |t|
      t.string "owner_type", null: false
      t.bigint "owner_id", null: false
      t.string "name"
      t.string "license"
      t.string "visibility"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.bigint "creator_id"
      t.index ["creator_id"], name: "index_models_on_creator_id"
      t.index ["owner_type", "owner_id"], name: "index_models_on_owner"
    end

    create_table "org_memberships", force: :cascade do |t|
      t.bigint "organization_id", null: false
      t.bigint "user_id", null: false
      t.integer "role"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.index ["organization_id"], name: "index_org_memberships_on_organization_id"
      t.index ["user_id"], name: "index_org_memberships_on_user_id"
    end

    create_table "organizations", force: :cascade do |t|
      t.string "name"
      t.string "nickname"
      t.string "logo"
      t.string "homepage"
      t.string "org_type"
      t.boolean "verified", default: false
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.bigint "creator_id"
      t.boolean "starhub_synced", default: false
      t.index ["name"], name: "index_organizations_on_name"
    end

    create_table "ssh_keys", force: :cascade do |t|
      t.bigint "user_id", null: false
      t.string "name", null: false
      t.text "ssh_key", null: false
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.boolean "starhub_synced", default: false
      t.index ["user_id"], name: "index_ssh_keys_on_user_id"
    end

    create_table "system_api_keys", force: :cascade do |t|
      t.string "service"
      t.string "secret_key"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
    end

    create_table "system_configs", force: :cascade do |t|
      t.string "application_env"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
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
      t.string "tag_origin", default: "user_created"
      t.string "tag_type", default: "task"
      t.string "tag_field"
      t.string "zh_name"
      t.text "desc"
      t.integer "weight"
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
      t.string "nickname"
      t.string "git_token"
      t.boolean "starhub_synced", default: false
      t.string "git_token_name"
      t.string "password_hash"
      t.index ["login_identity"], name: "index_users_on_login_identity", unique: true
    end

    add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
    add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
    add_foreign_key "comments", "users"
    add_foreign_key "datasets", "users", column: "creator_id"
    add_foreign_key "models", "users", column: "creator_id"
    add_foreign_key "org_memberships", "organizations"
    add_foreign_key "org_memberships", "users"
    add_foreign_key "ssh_keys", "users"
    add_foreign_key "taggings", "tags"
  end
end

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

ActiveRecord::Schema[7.0].define(version: 2023_12_13_120759) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

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

  create_table "campaigns", force: :cascade do |t|
    t.string "name"
    t.string "uuid"
    t.string "location"
    t.datetime "start_date"
    t.datetime "end_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "organizer"
    t.string "organizer_website"
    t.integer "pageviews", default: 0
    t.integer "campaign_type"
    t.integer "status", default: 0
    t.boolean "recommended", default: false
    t.boolean "release", default: false
    t.index ["uuid"], name: "index_campaigns_on_uuid"
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

  create_table "lead_forms", force: :cascade do |t|
    t.string "lead_source"
    t.string "channel"
    t.string "lead_status"
    t.string "local_channel"
    t.string "lead_type"
    t.string "lead_fields"
    t.string "uuid"
    t.string "lead_form_status", default: "inactive"
    t.string "title"
    t.string "internal_title"
    t.text "description"
    t.string "custom_required_fields"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "campaign_id", null: false
    t.index ["campaign_id"], name: "index_lead_forms_on_campaign_id"
  end

  create_table "leads", force: :cascade do |t|
    t.text "additional_notes"
    t.string "channel"
    t.string "lead_type"
    t.string "company"
    t.string "email"
    t.string "email_opt_out"
    t.string "phone"
    t.string "name"
    t.string "num_of_employees"
    t.string "province"
    t.string "title"
    t.string "utm_content"
    t.string "utm_medium"
    t.string "utm_source"
    t.string "lead_source"
    t.string "region"
    t.string "utm_campaign"
    t.string "sync_status"
    t.string "industry"
    t.string "local_channel"
    t.string "uploads_tag"
    t.string "lead_status"
    t.string "lead_form_uuid"
    t.string "utm_keyword"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "expertise"
    t.text "introduction"
    t.string "company_site"
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
    t.index ["name"], name: "index_organizations_on_name"
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

  create_table "system_configs", force: :cascade do |t|
    t.string "application_env"
    t.jsonb "oidc_configs", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "ssh_keys", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.text "ssh_key", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_ssh_keys_on_user_id"
  end

  create_table "system_api_keys", force: :cascade do |t|
    t.string "service"
    t.string "secret_key"
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
    t.index ["login_identity"], name: "index_users_on_login_identity", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "comments", "users"
  add_foreign_key "lead_forms", "campaigns"
  add_foreign_key "ssh_keys", "users"
  add_foreign_key "org_memberships", "organizations"
  add_foreign_key "org_memberships", "users"
  add_foreign_key "taggings", "spaces"
  add_foreign_key "taggings", "tags"
end

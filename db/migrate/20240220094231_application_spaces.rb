class ApplicationSpaces < ActiveRecord::Migration[7.0]
  def change
    create_table "application_spaces", force: :cascade do |t|
      t.string "name"
      t.string "license"
      t.string "visibility"
      t.string "owner_type", null: false
      t.string "cover_image"
      t.string "sdk"
      t.string "cloud_resource"
      t.bigint "owner_id", null: false
      t.bigint "creator_id"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.index ["creator_id"], name: "index_application_spaces_on_creator_id"
      t.index ["owner_type", "owner_id"], name: "index_application_spaces_on_owner"
    end
  end
end

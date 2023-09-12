class CreateSpaces < ActiveRecord::Migration[7.0]
  def change
    create_table :spaces do |t|
      t.references :user, null: false
      t.string :space_starchain_id
      t.string :title
      t.text :desc
      t.string :site_link
      t.string :space_type
      t.integer :status, default: 0, null: false

      t.timestamps
    end
  end
end

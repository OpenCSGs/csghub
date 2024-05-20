class CreateAdminPhotos < ActiveRecord::Migration[7.0]
  def change
    create_table :admin_photos do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title
      t.string :url

      t.timestamps
    end
  end
end

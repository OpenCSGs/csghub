class CreateMirrors < ActiveRecord::Migration[7.0]
  def change
    create_table :mirrors do |t|
      t.string :source_url
      t.string :mirror_source_id
      t.string :username
      t.string :access_token

      t.timestamps
    end
  end
end

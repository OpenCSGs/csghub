class CreateSshKeys < ActiveRecord::Migration[7.0]
  def change
    create_table :ssh_keys do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.text :ssh_key

      t.timestamps
    end
  end
end

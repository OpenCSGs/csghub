class ChangeNotNullConstraintsInSshKeys < ActiveRecord::Migration[7.0]
  def change
    change_column :ssh_keys, :name, :string, null: false
    change_column :ssh_keys, :ssh_key, :text, null: false
  end
end

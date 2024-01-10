class AddPasswordHashToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :password_hash, :string
  end
end

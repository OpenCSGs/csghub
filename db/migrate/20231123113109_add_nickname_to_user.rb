class AddNicknameToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :nickname, :string
  end
end

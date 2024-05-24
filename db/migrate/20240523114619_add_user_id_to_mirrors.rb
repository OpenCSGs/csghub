class AddUserIdToMirrors < ActiveRecord::Migration[7.0]
  def change
    add_column :mirrors, :user_id, :bigint
  end
end

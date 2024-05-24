class AddRepoToMirrors < ActiveRecord::Migration[7.0]
  def change
    add_column :mirrors, :mirrorable_type, :string
    add_column :mirrors, :mirrorable_id, :bigint
  end
end

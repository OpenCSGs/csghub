class AddCreatorIdToOrganization < ActiveRecord::Migration[7.0]
  def change
    add_column :organizations, :creator_id, :bigint
  end
end

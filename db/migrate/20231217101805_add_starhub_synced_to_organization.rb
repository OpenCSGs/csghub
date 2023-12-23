class AddStarhubSyncedToOrganization < ActiveRecord::Migration[7.0]
  def change
    add_column :organizations, :starhub_synced, :boolean, default: false
  end
end

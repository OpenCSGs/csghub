class AddStarhubSyncedToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :starhub_synced, :boolean, default: false
  end
end

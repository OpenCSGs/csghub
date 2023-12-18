class AddStarhubSyncedToSshKeys < ActiveRecord::Migration[7.0]
  def change
    add_column :ssh_keys, :starhub_synced, :boolean, default: false
  end
end

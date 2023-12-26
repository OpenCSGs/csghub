class AddStarhubConfigsToSystemConfigs < ActiveRecord::Migration[7.0]
  def change
    add_column :system_configs, :starhub_configs, :jsonb, default: {}
  end
end

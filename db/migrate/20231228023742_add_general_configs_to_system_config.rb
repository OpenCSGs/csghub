class AddGeneralConfigsToSystemConfig < ActiveRecord::Migration[7.0]
  def change
    add_column :system_configs, :general_configs, :jsonb, default: {}
  end
end

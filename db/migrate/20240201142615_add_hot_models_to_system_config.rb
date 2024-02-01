class AddHotModelsToSystemConfig < ActiveRecord::Migration[7.0]
  def change
    add_column :system_configs, :hot_models, :jsonb, default: {}
    add_column :system_configs, :hot_datasets, :jsonb, default: {}
  end
end

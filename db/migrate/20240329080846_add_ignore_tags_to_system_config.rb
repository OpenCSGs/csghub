class AddIgnoreTagsToSystemConfig < ActiveRecord::Migration[7.0]
  def change
    add_column :system_configs, :ignore_model_tags, :jsonb, default: {}
    add_column :system_configs, :ignore_dataset_tags, :jsonb, default: {}
  end
end

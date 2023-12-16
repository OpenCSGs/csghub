class AddFeatureFlagsToSystemConfig < ActiveRecord::Migration[7.0]
  def change
    add_column :system_configs, :feature_flags, :jsonb, default: {}
  end
end

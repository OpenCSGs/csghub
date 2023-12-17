class AddLicenseConfigsToSystemConfigs < ActiveRecord::Migration[7.0]
  def change
    add_column :system_configs, :license_configs, :jsonb, default: {}
  end
end

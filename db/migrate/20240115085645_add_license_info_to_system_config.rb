class AddLicenseInfoToSystemConfig < ActiveRecord::Migration[7.0]
  def change
    add_column :system_configs, :license_info, :json, default: {}
  end
end

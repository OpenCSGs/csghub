class AddS3ConfigsToSystemConfigs < ActiveRecord::Migration[7.0]
  def change
    add_column :system_configs, :s3_configs, :jsonb
  end
end

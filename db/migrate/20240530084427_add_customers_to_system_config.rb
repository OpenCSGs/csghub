class AddCustomersToSystemConfig < ActiveRecord::Migration[7.0]
  def change
    add_column :system_configs, :customers, :jsonb
  end
end

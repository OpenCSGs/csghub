class AddHotSpacesToSystemConfig < ActiveRecord::Migration[7.0]
  def change
    add_column :system_configs, :hot_spaces, :jsonb, default: {}
  end
end

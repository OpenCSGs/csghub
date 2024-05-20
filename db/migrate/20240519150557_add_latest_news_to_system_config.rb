class AddLatestNewsToSystemConfig < ActiveRecord::Migration[7.0]
  def change
    add_column :system_configs, :latest_news, :jsonb, default: {}
  end
end

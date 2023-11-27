class CreateSystemConfigs < ActiveRecord::Migration[7.0]
  def change
    create_table :system_configs do |t|
      t.string :application_env
      t.jsonb :oidc_configs, default: {}

      t.timestamps
    end
  end
end

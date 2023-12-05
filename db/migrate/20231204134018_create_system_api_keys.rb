class CreateSystemApiKeys < ActiveRecord::Migration[7.0]
  def change
    create_table :system_api_keys do |t|
      t.string :service
      t.string :secret_key

      t.timestamps
    end
  end
end

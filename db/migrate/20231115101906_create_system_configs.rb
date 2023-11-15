class CreateSystemConfigs < ActiveRecord::Migration[7.0]
  def change
    create_table :system_configs do |t|
      t.string :oidc_signup_url
      t.string :oidc_signin_url

      t.timestamps
    end
  end
end

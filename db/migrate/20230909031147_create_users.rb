class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :login_identity
      t.string :name
      t.string :gender
      t.integer :roles_mask
      t.string :phone
      t.boolean :phone_verified
      t.string :email
      t.boolean :email_verified
      t.datetime :last_login_at

      t.index ['login_identity'], name: "index_users_on_login_identity", unique: true

      t.timestamps
    end
  end
end

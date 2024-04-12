class AddSessionIpToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :session_ip, :string, default: ''
  end
end

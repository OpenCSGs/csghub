class CreateErrorLogs < ActiveRecord::Migration[7.0]
  def change
    create_table :error_logs do |t|
      t.string :request
      t.text :payload
      t.string :user_info
      t.string :message

      t.timestamps
    end
  end
end

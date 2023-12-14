class CreateDiscussions < ActiveRecord::Migration[7.0]
  def change
    create_table :discussions do |t|
      t.bigint :user_id, null: false
      t.string :title, null: false
      t.bigint :discussionable_id, null: false
      t.string :discussionable_type, null: false

      t.timestamps
    end
  end
end

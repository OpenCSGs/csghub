class CreateEmailGroups < ActiveRecord::Migration[7.0]
  def change
    create_table :email_groups do |t|
      t.string :name
      t.text :email_list

      t.timestamps
    end
  end
end

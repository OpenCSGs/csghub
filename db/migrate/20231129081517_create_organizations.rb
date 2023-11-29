class CreateOrganizations < ActiveRecord::Migration[7.0]
  def change
    create_table :organizations do |t|
      t.string :name
      t.string :nickname
      t.string :logo
      t.string :homepage
      t.string :org_type
      t.boolean :verified

      t.index :name
      t.timestamps
    end
  end
end

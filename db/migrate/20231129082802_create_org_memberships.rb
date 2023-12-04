class CreateOrgMemberships < ActiveRecord::Migration[7.0]
  def change
    create_table :org_memberships do |t|
      t.references :organization, null: false, foreign_key: true, index: true
      t.references :user, null: false, foreign_key: true, index: true
      t.integer :role

      t.timestamps
    end
  end
end

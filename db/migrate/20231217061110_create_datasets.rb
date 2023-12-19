class CreateDatasets < ActiveRecord::Migration[7.0]
  def change
    create_table :datasets do |t|
      t.string :name
      t.string :license
      t.string :visibility
      t.references :owner, polymorphic: true, null: false
      t.references :creator, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end

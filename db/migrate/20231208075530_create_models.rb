class CreateModels < ActiveRecord::Migration[7.0]
  def change
    create_table :models do |t|
      t.references :owner, polymorphic: true, null: false
      t.string :name
      t.string :license
      t.string :visibility

      t.timestamps
    end
  end
end

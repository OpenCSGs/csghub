class CreateCodes < ActiveRecord::Migration[7.0]
  def change
    create_table :codes do |t|
      t.references :owner, polymorphic: true, null: false
      t.string :name
      t.string :license
      t.string :visibility
      t.bigint :creator_id
      t.string :nickname
      t.text :desc

      t.timestamps
    end
  end
end

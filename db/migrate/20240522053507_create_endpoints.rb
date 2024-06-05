class CreateEndpoints < ActiveRecord::Migration[7.0]
  def change
    create_table :endpoints do |t|
      t.string :name
      t.string :cloud_resource
      t.integer :max_replica
      t.integer :min_replica
      t.integer :framework_id
      t.string :visibility
      t.bigint :creator_id
      t.string :model_path
      t.references :owner, polymorphic: true, null: false

      t.timestamps
    end
  end
end

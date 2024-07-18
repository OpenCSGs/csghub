class AddClusterIdToEndpoints < ActiveRecord::Migration[7.0]
  def change
    add_column :endpoints, :cluster_id, :string
  end
end

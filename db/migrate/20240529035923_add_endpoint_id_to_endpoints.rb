class AddEndpointIdToEndpoints < ActiveRecord::Migration[7.0]
  def change
    add_column :endpoints, :endpoint_id, :integer
  end
end

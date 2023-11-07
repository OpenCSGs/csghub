class AddStatusToCampaign < ActiveRecord::Migration[7.0]
  def change
    add_column :campaigns, :status, :integer, default: 0
  end
end

class AddRecommendedToCampaigns < ActiveRecord::Migration[7.0]
  def change
    add_column :campaigns, :recommended, :boolean, default: false
  end
end

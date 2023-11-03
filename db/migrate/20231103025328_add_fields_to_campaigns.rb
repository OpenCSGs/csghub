class AddFieldsToCampaigns < ActiveRecord::Migration[7.0]
  def change
    add_column :campaigns, :organizer, :string
    add_column :campaigns, :views, :integer
    add_column :campaigns, :campaign_type, :string
  end
end

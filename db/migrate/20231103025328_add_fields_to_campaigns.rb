class AddFieldsToCampaigns < ActiveRecord::Migration[7.0]
  def change
    add_column :campaigns, :organizer, :string
    add_column :campaigns, :organizer_website, :string
    add_column :campaigns, :pageviews, :integer
    add_column :campaigns, :campaign_type, :integer
  end
end

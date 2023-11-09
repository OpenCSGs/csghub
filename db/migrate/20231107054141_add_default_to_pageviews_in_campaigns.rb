class AddDefaultToPageviewsInCampaigns < ActiveRecord::Migration[7.0]
  def change
    change_column_default :campaigns, :pageviews, 0
  end
end

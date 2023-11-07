class CampaignsController < ApplicationController
  def show
    @campaign = Campaign.find params[:id]
    @related_spaces = Space.left_joins(:tags).where(tags: {name: @campaign.name})
  end
end

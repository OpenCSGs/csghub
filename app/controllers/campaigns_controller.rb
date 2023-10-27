class CampaignsController < ApplicationController
  def show
    @campaign = Campaign.find params[:id]
  end
end

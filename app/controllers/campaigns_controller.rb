class CampaignsController < ApplicationController
  def show
    @campaign = Campaign.first
  end

  def edit
    @campaign = Campaign.first
  end
end

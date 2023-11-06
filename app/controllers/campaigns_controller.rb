class CampaignsController < ApplicationController
  before_action :authenticate_user

  def index
    @total_campaigns = Campaign.all
    @campaigns = @total_campaigns.page(params[:page]).map(&:with_content_and_leads_count)
  end

  def show
    @campaign = Campaign.find params[:id]
  end
end

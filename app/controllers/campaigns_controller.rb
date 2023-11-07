class CampaignsController < ApplicationController
  before_action :authenticate_user

  def index
    @total_campaigns = Campaign.all.order(created_at: :desc)
    @campaigns = @total_campaigns.page(params[:page]).map(&:with_content_and_leads_count)
    @recommended_campaigns = Campaign.recommended.map(&:banner_attributes)
  end

  def show
    @campaign = Campaign.find params[:id]
  end
end

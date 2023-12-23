class InternalApi::CampaignsController < InternalApi::ApplicationController
  def index
    @total_campaigns = Campaign.all.order(created_at: :desc)
    @campaigns = @total_campaigns.page(params[:page]).map(&:with_content_and_leads_count)
    render json: {campaigns: @campaigns.to_json, total_cards: @total_campaigns.count}
  end
end

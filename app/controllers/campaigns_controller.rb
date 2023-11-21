class CampaignsController < ApplicationController
  def index
    @released_campaigns = Campaign.release
    @total_campaigns = @released_campaigns.order(created_at: :desc)
    @campaigns = @total_campaigns.page(params[:page]).map(&:with_content_and_leads_count)
    @recommended_campaigns = @released_campaigns.recommended.map(&:banner_attributes)
  end

  def show
    @campaign = Campaign.release.find_by(id: params[:id])
    if @campaign.nil?
      return redirect_to root_path, alert: '未找到符合条件的活动'
    end
    @related_spaces = Space.left_joins(:tags).where(tags: {name: @campaign.name})
    # Increment the pageview count of the campaign when it is viewed
    @campaign.pageviews += 1
    @campaign.save
  end
end

class CampaignsController < ApplicationController
  def index
    @release_campaigns = Campaign.release
    @total_campaigns = @release_campaigns.all.order(created_at: :desc)
    @campaigns = @total_campaigns.page(params[:page]).map(&:with_content_and_leads_count)
    @recommended_campaigns = @release_campaigns.recommended.map(&:banner_attributes)
  end

  def show
    @campaign = Campaign.find_by(id: params[:id], release: true)
    if @campaign.nil?
      return redirect_to root_path, alert: '未找到符合条件的活动'
    end
    @related_spaces = Space.left_joins(:tags).where(tags: {name: @campaign.name})
    # Increment the pageview count of the campaign when it is viewed
    @campaign.pageviews += 1
    @campaign.save
  end
end

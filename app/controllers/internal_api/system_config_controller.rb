class InternalApi::SystemConfigController < InternalApi::ApplicationController
  def latest_news
    @latest_news = load_latest_news
    render json: {latest_news: @latest_news}
  end

  private

  def load_latest_news
    system_config = SystemConfig.first
    system_config.latest_news rescue []
  end
end

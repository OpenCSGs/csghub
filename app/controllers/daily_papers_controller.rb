class DailyPapersController < ApplicationController
  def index
    @daily_papers = DailyPaper.search_by(params[:keywords])
                              .order(published_at: :desc)
                              .page(params[:page]).per(8)
    @keywords = params[:keywords]
    @page = params[:page]
  end

  def new
    authorize DailyPaper
  end
end
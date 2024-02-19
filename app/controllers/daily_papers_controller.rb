class DailyPapersController < ApplicationController
  def index
    daily_papers = DailyPaper.order(published_at: :desc).page(params[:page]).per(8)
  end

  def new
    authorize DailyPaper
  end
end
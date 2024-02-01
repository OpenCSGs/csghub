class DailyPapersController < ApplicationController
  before_action :check_admin, only: [:new]

  def index
    daily_papers = DailyPaper.order(published_at: :desc).page(params[:page]).per(8)
  end

  def new
  end

  private

  def check_admin
    unless current_user.admin?
      return render json: { message: '没有权限' }, status: 403
    end
  end
end
class DailyPapersController < ApplicationController
  before_action :check_admin, only: [:new, :create]
  def new
  end

  def create
    daily_paper = current_user.daily_paper.new(create_params)
    if daily_paper.save
      render json: { success: true, message: '创建成功' }
    else
      render json: { success: false, message: daily_paper.errors.full_messages.join(',') }
    end
  end

  def index
    daily_papers = DailyPaper.order(published_at: :desc).page(params[:page]).per(8)
    
  end

  private

  def check_admin
    unless current_user.admin?
      return render json: { message: '没有权限' }, status: 403
    end
  end

  def create_params
    params.require(:daily_paper).permit(
      :title, :article_link, :published_at, :pdf_link, :recommendation,
      :description, :video_link, :cover_url, model_links: [], dataset_links: []
    )
  end
end
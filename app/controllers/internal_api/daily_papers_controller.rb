class InternalApi::DailyPapersController < InternalApi::ApplicationController
  def create
    authorize DailyPaper

    daily_paper = current_user.daily_paper.new(create_params)
    if daily_paper.save
      render json: { message: '创建成功' }, status: :ok
    else
      render json: { message: daily_paper.errors.full_messages.to_sentence }, status: :bad_request
    end
  end

  private

  def create_params
    params.require(:daily_paper).permit(
      :title, :article_link, :published_at, :pdf_link, :recommendation,
      :description, :video_link, :cover_url, model_links: [], dataset_links: []
    )
  end
end
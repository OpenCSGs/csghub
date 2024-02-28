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

  def show
    @daily_paper = DailyPaper.find_by!(uuid: params[:uuid])

    model_list_result = Starhub.api.models_by_paths @daily_paper.model_links
    dataset_list_result = Starhub.api.datasets_by_paths @daily_paper.dataset_links
    @model_data = JSON.parse(model_list_result)['data']
    @dataset_data = JSON.parse(dataset_list_result)['data']
  end
end
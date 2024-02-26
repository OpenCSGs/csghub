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
    @daily_paper = DailyPaper.find_by(uuid: params[:uuid])
    model_links = @daily_paper.model_links rescue []
    dataset_links = @daily_paper.dataset_links rescue []
    model_data = Starhub.api.models_by_paths(model_links)
    dataset_data = Starhub.api.datasets_by_paths(dataset_links)
    @model_data = JSON.parse(model_data)['data'] || []
    @dataset_data = JSON.parse(dataset_data)['data'] || []
  end
end
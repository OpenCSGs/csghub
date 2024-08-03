class DailyPapersController < ApplicationController
  def index
    @daily_papers = DailyPaper.search_by(params[:keywords])
                              .order(id: :desc)
                              .page(params[:page]).per(9)
    @total_count = @daily_papers.total_count
    @keywords = params[:keywords]
    @page = params[:page]
    merge_recommender_url
  end

  def new
    authorize DailyPaper
  end

  def show
    @daily_paper = DailyPaper.find_by!(uuid: params[:uuid])

    @model_data = []
    if @daily_paper.model_links.present?
      model_list_result = csghub_api.models_by_paths @daily_paper.model_links
      @model_data = JSON.parse(model_list_result)['data']
    end
    @dataset_data = []
    if @daily_paper.dataset_links.present?
      dataset_list_result = csghub_api.datasets_by_paths @daily_paper.dataset_links
      @dataset_data = JSON.parse(dataset_list_result)['data']
    end
  end

  private

  def merge_recommender_url
    @daily_papers = @daily_papers.map do |daily_paper|
      {
        daily_paper: daily_paper,
        recommender_url: '/profile/' + daily_paper.recommender.name
      }
    end
  end
end

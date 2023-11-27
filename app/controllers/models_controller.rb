class ModelsController < ApplicationController
  def index
  end

  def show
    @model = Starhub.api.get_model_detail(params[:user_name], params[:model_name])
    @files = Starhub.api.get_model_files(params[:user_name], params[:model_name])
  end
end

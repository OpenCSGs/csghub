class DatasetsController < ApplicationController
  def index
  end

  def show
    @dataset = Starhub.api.get_datasets_detail(params[:user_name], params[:datasets_name])
    @files = Starhub.api.get_datasets_files(params[:user_name], params[:datasets_name])
    @last_commit = Starhub.api.get_datasets_last_commit(params[:user_name], params[:datasets_name])
    @branches = Starhub.api.get_datasets_branches(params[:user_name], params[:datasets_name])
  end
end

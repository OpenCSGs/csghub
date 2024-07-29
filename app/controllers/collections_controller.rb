class CollectionsController < ApplicationController
  layout 'repo_application'

  before_action :check_user_info_integrity

  def index
  end

  def new
    @available_namespaces = current_user.available_namespaces
  end

  def show
    @collections_id = params[:collections_id]
    @path = params[:path]
  end

end

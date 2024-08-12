class CollectionsController < ApplicationController
  # Todo: remove later
  # before_action :check_user_info_integrity
  before_action :authenticate_user, only: :new

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

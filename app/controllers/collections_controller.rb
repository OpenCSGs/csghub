class CollectionsController < ApplicationController
  before_action :authenticate_user, only: :new

  def index
  end

  def new
  end

  def show
    @collections_id = params[:collections_id]
    @path = params[:path]
  end

end

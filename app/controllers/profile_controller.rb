class ProfileController < ApplicationController
  before_action :authenticate_user

  def index
    # @datasets = current_user.datasets
    # @models = current_user.models
    @spaces = current_user.spaces
  end
end

class ProfileController < ApplicationController
  before_action :authenticate_user

  def index
    @models = current_user.models.map(&:as_json)
    @datasets = [] # TODO current_user.datasets
    @spaces = current_user.spaces
    @organizations = current_user.organizations
  end
end

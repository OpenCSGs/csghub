class ProfileController < ApplicationController
  before_action :authenticate_user

  def index
    @models = current_user.models.map(&:as_json)
    @datasets = current_user.datasets.map(&:as_json)
    @spaces = current_user.spaces
    @organizations = current_user.organizations
  end
end

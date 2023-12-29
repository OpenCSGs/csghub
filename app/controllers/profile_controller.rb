class ProfileController < ApplicationController
  before_action :authenticate_user
  before_action :check_user_info_integrity

  def index
    @models = Starhub.api.get_user_models(current_user.name, current_user.name)
    @datasets = Starhub.api.get_user_datasets(current_user.name, current_user.name)
    @spaces = current_user.spaces
    @organizations = current_user.organizations
  end
end

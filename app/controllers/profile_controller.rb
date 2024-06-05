class ProfileController < ApplicationController
  layout 'repo_application'

  before_action :check_user_info_integrity

  def index
    @user ||= User.find_by(login_identity: params[:user_id])
    return redirect_to errors_not_found_path unless @user

    @models = csghub_api.get_user_models(@user.name, current_user&.name)
    @datasets = csghub_api.get_user_datasets(@user.name, current_user&.name)
    @spaces = csghub_api.get_user_application_spaces(@user.name, current_user&.name)
    @codes = csghub_api.get_user_codes(@user.name, current_user&.name)
    @endpoints = csghub_api.get_user_endpoints(@user.name, current_user&.name)
    @organizations = @user.organizations
    @is_current_user_access = current_user.present? && (current_user == @user)
    @initiator = "profile"
  end

  def likes
    @user ||= User.find_by(name: params[:user_id])
    return redirect_to errors_not_found_path unless @user

    @models = csghub_api.get_user_likes(@user.name, 'models')
    @datasets = csghub_api.get_user_likes(@user.name, 'datasets')
    @spaces = csghub_api.get_user_likes(@user.name, 'spaces')
    @codes = csghub_api.get_user_likes(@user.name, 'codes')
    @organizations = @user.organizations
    @is_current_user_access = current_user.present? && (current_user == @user)
    @initiator = "likes"
  end
end

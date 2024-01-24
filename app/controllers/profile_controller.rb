class ProfileController < ApplicationController
  before_action :check_user_info_integrity

  def index
    @user ||= User.find_by(name: params[:user_id])
    return redirect_to errors_not_found_path unless @user

    @models = Starhub.api.get_user_models(@user.name, current_user&.name)
    @datasets = Starhub.api.get_user_datasets(@user.name, current_user&.name)
    @spaces = @user.spaces
    @organizations = @user.organizations
    @is_current_user_access = current_user.present? && (current_user == @user)
  end
end

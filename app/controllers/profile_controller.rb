class ProfileController < ApplicationController
  before_action :authenticate_user
  before_action :check_user_info_integrity

  def index
    @user ||= User.find_by(name: params[:user_id])
    return redirect_to errors_not_found_path unless @user

    @models = Starhub.api.get_user_models(@user.name, @user.name)
    @datasets = Starhub.api.get_user_datasets(@user.name, @user.name)
    @organizations = @user.organizations
  end
end

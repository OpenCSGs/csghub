class ProfileController < ApplicationController
  before_action :check_user_info_integrity

  def index
    @user ||= User.find_by(name: params[:user_id])
    return redirect_to errors_not_found_path unless @user

    @organizations = @user.organizations
    @is_current_user_access = current_user.present? && (current_user == @user)
    @user_id = params[:user_id]
    @initiator = "profile"
  end

  def likes
    @user ||= User.find_by(name: params[:user_id])
    return redirect_to errors_not_found_path unless @user

    @organizations = @user.organizations
    @is_current_user_access = current_user.present? && (current_user == @user)
    @initiator = "likes"
  end
end

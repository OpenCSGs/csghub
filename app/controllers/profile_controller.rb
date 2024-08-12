class ProfileController < ApplicationController
  def index
    @user ||= User.find_by(name: params[:user_id])
    return redirect_to errors_not_found_path unless @user
    @initiator = "profile"
  end

  def likes
    @user ||= User.find_by(name: params[:user_id])
    return redirect_to errors_not_found_path unless @user
    @initiator = "likes"
  end
end

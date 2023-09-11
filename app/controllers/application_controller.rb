class ApplicationController < ActionController::Base
  def authenticate_user
    if helpers.logged_in?
      return true
    else
      session[:original_request_path] = request.fullpath
      redirect_to login_path
    end
  end

  private

  def current_user
    helpers.current_user
  end
end

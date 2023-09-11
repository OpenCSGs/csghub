class ApplicationController < ActionController::Base
  before_action :set_default_locale

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

  def set_default_locale
    I18n.locale = params[:locale] || session[:locale] || I18n.default_locale
    session[:locale] = I18n.locale
  end
end

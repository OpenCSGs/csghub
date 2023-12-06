class ApplicationController < ActionController::Base
  include Pundit::Authorization

  before_action :set_default_locale, :check_user_login

  def authenticate_user
    if helpers.logged_in?
      return true
    elsif helpers.logged_in_other_system?
      authing_id_token = cookies[:idToken]
      user_infos = JWT.decode(authing_id_token, nil, false).first

      user = User.find_or_create_by(login_identity: user_infos['sub']) do |u|
        u.roles = :personal_user
        u.avatar = user_infos['avatar']
        u.name = user_infos['name']
        u.phone = user_infos['phone']
        u.email = user_infos['email']
        u.email_verified = user_infos['emailVerified']
        u.gender = user_infos['gender']
        u.last_login_at = Time.now
      end

      helpers.log_in user
    else
      session[:original_request_path] = request.fullpath
      redirect_to root_path
    end
  rescue => e
    redirect_to root_path
  end

  def check_user_login
    return if helpers.logged_in?
    if helpers.logged_in_other_system?
      oidc_id_token = cookies[:idToken]
      user_infos = JWT.decode(oidc_id_token, nil, false).first

      user = User.find_or_create_by(login_identity: user_infos['sub']) do |u|
        u.roles = :personal_user
        u.avatar = user_infos['avatar']
        u.name = user_infos['name']
        u.phone = user_infos['phone']
        u.email = user_infos['email']
        u.email_verified = user_infos['emailVerified']
        u.gender = user_infos['gender']
        u.last_login_at = Time.now
      end

      helpers.log_in user
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

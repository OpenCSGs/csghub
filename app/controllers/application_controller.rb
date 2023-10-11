class ApplicationController < ActionController::Base
  include Pundit::Authorization

  before_action :set_default_locale

  def authenticate_user
    if helpers.logged_in?
      return true
    elsif helpers.logged_in_other_system?
      authing_id_token = cookies[:idToken]
      user_infos = JWT.decode(authing_id_token, nil, false).first
      user = User.find_by_login_identity(user_infos['sub'])
      unless user
        user = User.create(login_identity: user_infos['sub'],
                          avatar: user_infos['picture'],
                          name: user_infos['username'],
                          phone: user_infos['phone_number'],
                          phone_verified: user_infos['phone_number_verified'],
                          email: user_infos['email'],
                          email_verified: user_infos['email_verified'],
                          gender: user_infos['gender'],
                          last_login_at: Time.zone.now)
      end
      helpers.log_in user
    else
      session[:original_request_path] = request.fullpath
      redirect_to login_path
    end
  rescue => e
    redirect_to login_path
  end

  def check_user_login
    if helpers.logged_in?
      redirect_to root_path
    elsif helpers.logged_in_other_system?
      authing_id_token = cookies[:idToken]
      user_infos = JWT.decode(authing_id_token, nil, false).first
      user = User.find_by_login_identity(user_infos['sub'])
      unless user
        user = User.create(login_identity: user_infos['sub'],
                          avatar: user_infos['picture'],
                          name: user_infos['username'],
                          phone: user_infos['phone_number'],
                          phone_verified: user_infos['phone_number_verified'],
                          email: user_infos['email'],
                          email_verified: user_infos['email_verified'],
                          gender: user_infos['gender'],
                          last_login_at: Time.zone.now)
      end
      helpers.log_in user
      redirect_to root_path
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

module SessionsHelper
  def log_in user
    session[:login_identity] = user.login_identity
  end

  def current_user
    @current_user ||= User.find_by_login_identity(session[:login_identity].presence)
  end

  def logged_in?
    current_user.present?
  end

  def user_roles
    current_user.roles.join(',')
  end

  def logout
    session[:login_identity] = nil
    cookies.delete :authing_uuid, domain: current_cookie_domain
    cookies.delete :id_token, domain: current_cookie_domain
    cookies.delete :last_login_at, domain: current_cookie_domain
  end
end

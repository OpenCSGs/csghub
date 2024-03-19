module SessionsHelper
  def log_in user
    session[:login_identity] = user.login_identity
    cookies[:login_identity] = user.login_identity
    setup_jwt_token(user.name) if user.starhub_synced?
  end

  def current_user
    @current_user ||= User.find_by_login_identity(session[:login_identity].presence)
  end

  def logged_in?
    current_user.present?
  end

  def logged_in_other_system?
    cookies[:idToken].present?
  end

  def user_roles
    current_user.roles.join(',')
  end

  def logout
    session[:login_identity] = nil
    cookies.delete :oidcUuid, domain: current_cookie_domain
    cookies.delete :idToken, domain: current_cookie_domain
    cookies.delete :userinfos, domain: current_cookie_domain
    cookies.delete :login_identity
    cookies.delete :user_token
  end

  def is_on_premise?
    on_premise_from_env = ENV.fetch('ON_PREMISE', nil)

    system_config = SystemConfig.first
    feature_flags = (system_config.feature_flags rescue {}) || {}
    on_premise = on_premise_from_env || feature_flags['on_premise']

    on_premise.to_s == 'true'
  end

  def setup_jwt_token username
    res = Starhub.api.get_jwt_token(username)
    token = JSON.parse(res)['data']
    current_domain = Rails.env.development? ? 'localhost' : '.opencsg.com'
    cookies['user_token'] = {value: token, domain: current_domain}
  end
end

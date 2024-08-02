module SessionsHelper
  def log_in user
    session[:login_identity] = user.login_identity
    cookies[:login_identity] = user.login_identity
    cookies[:current_user] = user.name
    cookies[:current_user_email] = user.email
    cookies[:admin_user] = 'true' if user.admin?

    # need to add later
    # cookies[:avatar] = user.avatar
    # cookies[:roles] = user.roles

    # cookies[:user_synced] = user.starhub_synced
    # setup_jwt_token(user.name) if user.starhub_synced?
    user.update_column('session_ip', request.remote_ip)
  end

  def current_user
    login_identity = session[:login_identity].presence
    @current_user ||= login_identity && User.find_by_login_identity(login_identity)
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
    # unset current_user
    session[:login_identity] = nil
    cookies.delete :current_user
    cookies.delete :current_user_email
    cookies.delete :login_identity
    cookies.delete :user_token, domain: current_cookie_domain
    cookies.delete :token_expire_at
    cookies.delete :current_user
    cookies.delete :admin_user
    cookies.delete :can_change_username, domain: current_cookie_domain

    # unset odic cookies
    cookies.delete :oidcUuid, domain: current_cookie_domain
    cookies.delete :idToken, domain: current_cookie_domain
    cookies.delete :userinfos, domain: current_cookie_domain

    # unset starhub synced
    cookies.delete :user_synced
  end

  def is_on_premise?
    on_premise_from_env = ENV.fetch('ON_PREMISE', nil)

    system_config = SystemConfig.first
    feature_flags = (system_config.feature_flags rescue {}) || {}
    on_premise = on_premise_from_env || feature_flags['on_premise']

    on_premise.to_s == 'true'
  end

  def setup_jwt_token username
    res = csghub_api.get_jwt_token(username)
    token = JSON.parse(res)['data']['token']
    expire_time = JSON.parse(res)['data']['expire_at']
    current_domain = Rails.env.development? ? 'localhost' : '.opencsg.com'
    cookies['user_token'] = {value: token, domain: current_domain}
    cookies['token_expire_at'] = expire_time
  end
end

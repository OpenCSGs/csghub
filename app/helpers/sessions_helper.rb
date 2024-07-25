module SessionsHelper
  def log_in user
    session[:login_identity] = user.login_identity
    cookies[:login_identity] = user.login_identity
    cookies[:current_user] = user.name
    cookies[:user_synced] = user.starhub_synced
    setup_jwt_token(user.name) if user.starhub_synced?
    cookies[:admin_secret] = get_admin_secret if user.admin?
    user.update_column('session_ip', request.remote_ip)
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
    cookies.delete :oidcUuid
    cookies.delete :idToken
    cookies.delete :userinfos
    cookies.delete :login_identity
    cookies.delete :user_synced
    cookies.delete :user_token
    cookies.delete :token_expire_at
    cookies.delete :admin_secret
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
    cookies['user_token'] = token
    cookies['token_expire_at'] = expire_time
  end

  def get_admin_secret
    general_configs = (SystemConfig.first.general_configs rescue {}) || {}
    general_configs["admin_secret"]
  end
end

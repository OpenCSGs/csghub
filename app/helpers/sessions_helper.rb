module SessionsHelper
  def log_in user
    set_cookie 'login_identity', user.login_identity
    set_cookie 'current_user', user.name
    set_cookie 'admin_user', 'true' if user.admin?
    user.update_column('session_ip', request.remote_ip)
  end

  def current_user
    login_identity = cookies[:login_identity].presence
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
    unset_cookie :login_identity
    unset_cookie :current_user
    unset_cookie :admin_user

    # unset user token
    unset_cookie :user_token
    unset_cookie :can_change_username
    unset_cookie :user_token_valid

    # unset deprecated cookies
    unset_cookie :oidcUuid
    unset_cookie :idToken
    unset_cookie :userinfos
    unset_cookie :current_user_email
    unset_cookie :token_expire_at
    unset_cookie :user_synced
  end

  def is_on_premise?
    on_premise_from_env = ENV.fetch('ON_PREMISE', nil)
    on_premise_from_env.to_s == 'true'
  end

  def set_cookie name, value
    if cookie_domain
      cookies[name] = { value: value, domain: cookie_domain, expires: 7.days }
    else
      cookies[name] = { value: value, expires: 7.days }
    end
  end

  def unset_cookie name
    cookies.delete name
    possible_cookie_domains.each do |domain|
      cookies.delete name, domain: domain
    end
  end

  def possible_cookie_domains
    []
  end

  def cookie_domain
    nil
  end
end

require 'jwt'

class SessionsController < ApplicationController
  layout 'login'

  skip_before_action :check_user_login

  def signup
    redirect_to SystemConfig.first.oidc_configs['sign_up_url'], allow_other_host: true
  end

  def new
    redirect_to SystemConfig.first.oidc_configs['login_url'], allow_other_host: true
  end

  def oidc
    current_domain = Rails.env.development? ? 'localhost' : '.opencsg.com'
    @openid_client = ::OPENID_CLIENT
    @openid_client.authorization_code = params['code']
    access_token = @openid_client.access_token!
    user_infos = JWT.decode(access_token.id_token, nil, false).first
    Rails.logger.warn "===== User Info =====: #{user_infos}"
    cookies[:idToken] = {value: access_token.id_token, domain: current_domain}
    cookies[:oidcUuid] = {value: user_infos['sub'], domain: current_domain}
    cookies[:userinfos] = {value: user_infos.to_json, domain: current_domain}
    login_by_user_infos user_infos
  end

  def authing
    authing_uuid = cookies[:oidcUuid]
    authing_id_token = cookies[:idToken]
    last_login_at = cookies[:lastLoginAt]
    user_role = cookies[:isCompanyUser] == 'true' ? :company_user : :personal_user
    user_infos = JWT.decode(authing_id_token, nil, false).first
    user = User.find_by(login_identity: authing_uuid)
    if user
      user.update(roles: user_role)
      helpers.log_in user
    else
      user = User.create(login_identity: authing_uuid,
                         roles: user_role,
                         avatar: user_infos['picture'],
                         name: user_infos['username'],
                         phone: user_infos['phone_number'],
                         phone_verified: user_infos['phone_number_verified'],
                         email: user_infos['email'],
                         email_verified: user_infos['email_verified'],
                         gender: user_infos['gender'],
                         last_login_at: last_login_at)
      helpers.log_in user
    end

    if session[:original_request_path].present?
      redirect_path = session[:original_request_path]
      session[:original_request_path] = nil
      redirect_to redirect_path
    else
      redirect_to root_path
    end
  end

  def destroy
    helpers.logout
    redirect_to root_path
  end
end

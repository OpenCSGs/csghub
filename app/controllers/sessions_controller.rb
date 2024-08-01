require 'jwt'

class SessionsController < ApplicationController
  skip_before_action :check_user_login

  def signup
    return redirect_to root_path if helpers.logged_in?

    if helpers.is_on_premise?
      render 'signup'
    else
      signup_url = Oidc.instance.signup_url
      redirect_to signup_url, allow_other_host: true
    end
  end

  def new
    return redirect_to root_path if helpers.logged_in?

    if helpers.is_on_premise?
      render 'new'
    else
      login_url = Oidc.instance.login_url
      redirect_to login_url, allow_other_host: true
    end
  end

  def create
    user_name = params[:name]
    user = User.find_by!(name: user_name)

    if user.password != params[:password]
      flash[:alert] = "用户名密码错误"
      return redirect_to login_path
    end

    helpers.log_in user
    redirect_path = session.delete(:original_request_path) || root_path
    redirect_to redirect_path
  rescue => e
    flash[:alert] = "用户名密码错误"
    return redirect_to login_path
  end

  def registration
    if params['name'].blank? || params['password'].blank?
      flash[:alert] = '用户名不能为空'
      return redirect_to signup_path
    end

    user = User.new(name: params['name'],
                    login_identity: SecureRandom.uuid,
                    password: params['password'],
                    roles: :personal_user,
                    phone: params['phone'],
                    email: params['email'])

    if user.save
      helpers.log_in user
      redirect_path = session.delete(:original_request_path) || root_path
      redirect_to redirect_path
    else
      flash[:alert] = user.errors.full_messages
      redirect_to signup_path
    end
  end

  def server
    res = csghub_api.verify_jwt_token(params[:jwt])
    user_infos = JSON.parse(res)["data"]
    current_domain = Rails.env.development? ? 'localhost' : '.opencsg.com'
    cookies['user_token'] = {value: params[:jwt], domain: current_domain}
    cookies['token_expire_at'] = Time.at(params[:expire].to_i).in_time_zone("Beijing").strftime("%Y-%m-%d %H:%M:%S")
    login_by_server_user_infos user_infos
  end

  def oidc
    current_domain = Rails.env.development? ? 'localhost' : '.opencsg.com'
    @openid_client = Oidc.instance.client
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

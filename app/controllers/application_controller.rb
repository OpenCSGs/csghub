class ApplicationController < ActionController::Base
  include Pundit::Authorization

  before_action :set_default_locale, :check_user_login

  rescue_from StarhubError do |e|
    log_error e.message, e.backtrace
    flash[:alert] = e.message
    redirect_to errors_not_found_path
  end

  rescue_from SensitiveContentError do |e|
    log_error e.message, e.backtrace
    flash[:alert] = e.message
    redirect_to errors_unauthorized_path
  end

  def authenticate_user
    if helpers.logged_in?
      return true
    elsif helpers.logged_in_other_system?
      authing_id_token = cookies[:idToken]
      user_infos = JWT.decode(authing_id_token, nil, false).first
      login_by_user_infos user_infos
    else
      session[:original_request_path] = request.headers["Referer"]
      if request.fullpath.match(/\/internal_api.*/)
        render json: {message: "登录之后才能操作"}, status: 404
      else
        redirect_to root_path
      end
    end
  rescue => e
    redirect_to root_path
  end

  def check_user_login
    return if helpers.logged_in?
    if helpers.logged_in_other_system?
      oidc_id_token = cookies[:idToken]
      user_infos = JWT.decode(oidc_id_token, nil, false).first
      login_by_user_infos user_infos
    end
  end

  private

  def log_error message, backtrace
    ErrorLog.create(
      message: message,
      user_info: "#{current_user&.name} / #{current_user&.id} / #{current_user&.phone} / #{current_user&.email}",
      request: "#{request.method} #{request.path}",
      payload: request.params.to_s,
      backtrace: backtrace
    )
  end

  def current_user
    helpers.current_user
  end

  def set_default_locale
    I18n.locale = params[:locale] || session[:locale] || I18n.default_locale
    session[:locale] = I18n.locale
  end

  def login_by_user_infos user_infos
    user = User.find_by(login_identity: user_infos['sub'])
    if user
      helpers.log_in user
      redirect_path = session.delete(:original_request_path) || root_path
      return redirect_to redirect_path
    end

    user = (user_infos['phone'].presence && User.find_by(phone: user_infos['phone'])) ||
           (user_infos['email'].presence && User.find_by(email: user_infos['email']))
    if user
      user.login_identity = user_infos['sub']
      user.name = user_infos['name'] if user.name.blank?
      user.avatar = user_infos['avatar'] if user.avatar.blank?
      user.phone = user_infos['phone'] if user.phone.blank?
      user.email = user_infos['email'] if user.email.blank?
      unless user.save
        flash[:alert] = "当前用户存在历史数据冲突，请联系管理员处理"
        log_error "用户登录历史数据问题", user.errors.messages
        return redirect_to errors_unauthorized_path
      end
    else
      user = User.find_or_create_by!(login_identity: user_infos['sub']) do |u|
        u.roles = :personal_user
        u.avatar = user_infos['avatar']
        u.name = user_infos['name']
        u.phone = user_infos['phone']
        u.email = user_infos['email']
        u.email_verified = user_infos['emailVerified']
        u.gender = user_infos['gender']
        u.last_login_at = Time.now
      end
    end

    # 确保如果新的用户uuid没有保存，那么我们登录老的用户
    helpers.log_in user.reload
    redirect_path = session.delete(:original_request_path) || root_path
    redirect_to redirect_path
  end

  def check_user_info_integrity
    return unless helpers.logged_in?

    if current_user.email.blank?
      flash[:alert] = "请补充邮箱，以便能使用完整的功能"
      return redirect_to '/settings/profile'
    end

    unless current_user.starhub_synced?
      current_user.sync_to_starhub_server
    end
  end
end

class ApplicationController < ActionController::Base
  include Pundit::Authorization

  before_action :set_default_locale, :check_user_login, :call_event_api

  def call_event_api
    csghub_api.visit_url(request.fullpath)
  end

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

  rescue_from Pundit::NotAuthorizedError do |e|
    log_error "Pundit Not Allow", e.backtrace
    redirect_to errors_unauthorized_path
  end

  rescue_from ActiveRecord::RecordNotFound do |e|
    log_error "Record Not Found", e.backtrace
    redirect_to errors_not_found_path
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
        redirect_to login_path
      end
    end
  rescue => e
    redirect_to root_path
  end

  def authenticate_admin_user
    unless helpers.logged_in?
      return redirect_to login_path
    end
    unless current_user.admin?
      return redirect_to errors_unauthorized_path
    end
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
    browser_language = request.env['HTTP_ACCEPT_LANGUAGE']
    default_locale = if browser_language
                        browser_language.scan(/^[a-z]{2}/)&.first == 'zh' ? 'zh' : 'en'
                     else
                        I18n.default_locale
                     end
    I18n.locale = params[:locale] || cookies[:locale] || default_locale
    cookies[:locale] = I18n.locale
  end

  def login_by_user_infos user_infos
    user = User.find_by(login_identity: user_infos['sub'])

    if user
      helpers.log_in user
      redirect_path = session.delete(:original_request_path) || root_path
      return redirect_to redirect_path
    end

    # 非第三方授权场景
    if user_infos['wechat'].blank? && user_infos['github'].blank? && user_infos['gitlab'].blank?
      user = (user_infos['phone'].presence && User.find_by(phone: user_infos['phone'])) ||
            (user_infos['email'].presence && User.find_by(email: user_infos['email']))
      user_name = user_infos['name']
      nickname = user_infos['displayName']
      if user
        user.login_identity = user_infos['sub']
        if user.name.blank?
          if user_name.match(/^\d+$/)
            user.name = nil
          else
            user.name = user_name
          end
        end
        user.nickname = nickname if user.nickname.blank? && nickname.present?
        user.avatar = user_infos['avatar'] if user.avatar.blank?
        user.phone = user_infos['phone'] if user.phone.blank?
        user.email = user_infos['email'] if user.email.blank?
        unless user.save
          flash[:alert] = I18n.t('errors_page.flash_alert.historical_conflict')
          log_error "用户登录历史数据问题", user.errors.messages
          return redirect_to errors_unauthorized_path
        end
      else
        begin
          user = User.find_or_create_by!(login_identity: user_infos['sub']) do |u|
            u.roles = :personal_user
            u.avatar = user_infos['avatar']
            u.name = user_name
            u.nickname = nickname if nickname.present?
            u.phone = user_infos['phone']
            u.email = user_infos['email']
            u.email_verified = user_infos['emailVerified']
            u.gender = user_infos['gender']
            u.last_login_at = Time.now
          end
        rescue ActiveRecord::RecordInvalid => e
          # 处理异常情况
          flash[:alert] = "#{I18n.t('errors_page.flash_alert.login_error')}：#{e.message}"
          return redirect_to errors_unauthorized_path
        end
      end
    else
      user = User.new
      user.login_identity = user_infos['sub']
      user.nickname = user_infos['displayName']
      user.avatar = user_infos['avatar']
      user.roles = :personal_user
      user.wechat_id = user_infos['wechat']
      user.github_id = user_infos['github']
      user.gitlab_id = user_infos['gitlab']
      unless user.save
        flash[:alert] = I18n.t('errors_page.flash_alert.login_error')
        log_error "授权登录出错", user.errors.messages
        return redirect_to errors_unauthorized_path
      end
    end

    # 确保如果新的用户uuid没有保存，那么我们登录老的用户
    helpers.log_in user.reload

    redirect_path = session.delete(:original_request_path) || root_path
    redirect_to redirect_path
  end

  def check_user_info_integrity
    return if !helpers.logged_in?

    if current_user.email.blank? || current_user.name.blank?
      flash[:alert] = "请补充用户名和邮箱，以便能使用完整的功能"
      return redirect_to '/settings/profile'
    end

    unless current_user.starhub_synced?
      current_user.sync_to_starhub_server
    end
  end

  def relative_path_to_resolve_path type, content
    return unless content
    prefix = case type
             when 'model'
               "/models/#{params[:namespace]}/#{params[:model_name]}/resolve/main/"
             when 'dataset'
               "/datasets/#{params[:namespace]}/#{params[:dataset_name]}/resolve/main/"
             when 'code'
               "/codes/#{params[:namespace]}/#{params[:code_name]}/resolve/main/"
             when 'application_space'
               "/spaces/#{params[:namespace]}/#{params[:application_space_name]}/resolve/main/"
             end

    # handle markdown format image
    content = content.gsub(/\!\[(.*?)\]\((.*?)\)/) do |match|
      alt_text = $1
      image_path = $2
      if image_path.start_with?('http') || image_path.start_with?("/#{type}s/")
        match
      else
        "![#{alt_text}](#{prefix}#{image_path})"
      end
    end

    # handle img tag format image
    content = content.gsub(/src=['"]{1}(.*?)['"]{1}/) do |match|
      src = $1
      if src.start_with?('http') || src.start_with?("/#{type}s/")
        match
      else
        "src=#{prefix}#{src}"
      end
    end
  end

  def csghub_api
    Starhub.api(request.remote_ip)
  end

  helper_method :csghub_api
end

module ApplicationHelper
  def current_cookie_domain
    if Rails.env != 'development'
      '.opencsg.com'
    else
      'localhost'
    end
  end

  def authing_domain
    if Rails.env.production?
      Rails.application.credentials.authing.production.authing_domain
    else
      Rails.application.credentials.authing.staging.authing_domain
    end
  end

  def authing_app_id
    if Rails.env.production?
      Rails.application.credentials.authing.production.authing_app_id
    else
      Rails.application.credentials.authing.staging.authing_app_id
    end
  end

  def logout_address
    asset_host = ENV.fetch('ASSET_HOST', 'http://localhost:3000')
    "#{asset_host}/logout"
    # ToDo: will remove in later
    # "#{authing_domain}/login/profile/logout?redirect_uri=#{asset_host}/logout"
  end

  def starchain_address
    if logged_in?
      raw_starchain_address
    else
      '/login'
    end
  end

  def raw_starchain_address
    if Rails.env.production?
      "https://starchain.opencsg.com"
    else
      "https://starchain-stg.opencsg.com"
    end
  end

  def current_locale
    I18n.locale
  end

  def campaign_status_type status
    case status
    when 'prestart'
      'warning'
    when 'signing_up'
      ''
    when 'in_progress'
      'success'
    when 'ended'
      'danger'
    end
  end

  def feature_flags
    system_config = SystemConfig.first
    if system_config
      system_config.feature_flags rescue {}
    else
      {}
    end
  end
end

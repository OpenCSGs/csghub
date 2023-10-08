module ApplicationHelper
  def current_cookie_domain
    if Rails.env != 'development'
      'opencsg.com'
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
    "#{authing_domain}/login/profile/logout?redirect_uri=#{asset_host}/logout"
  end

  def starchain_address
    if Rails.env.production?
      "https://starchain.opencsg.com"
    else
      "https://starchain-stg.opencsg.com"
    end
  end

  def current_locale
    I18n.locale
  end
end

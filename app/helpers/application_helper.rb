module ApplicationHelper
  def current_cookie_domain
    if Rails.env == 'production'
      'opencsg.com'
    else
      'localhost'
    end
  end

  def logout_address
    asset_host = ENV.fetch('ASSET_HOST', 'http://localhost:3000')
    "#{Rails.application.credentials[:authing_domain]}/login/profile/logout?redirect_uri=#{asset_host}/logout"
  end

  def current_locale
    I18n.locale
  end
end

module ApplicationHelper
  def current_domain
    if Rails.env == 'production'
      'opencsg.com'
    else
      'localhost'
    end
  end

  def logout_address
    if Rails.env == 'production'
      "https://qszku65kpvg0.authing.cn/login/profile/logout?redirect_uri=https://opencsg.com/logout"
    else
      "https://qszku65kpvg0.authing.cn/login/profile/logout?redirect_uri=http://localhost:3000/logout"
    end
  end

  def current_locale
    I18n.locale
  end
end

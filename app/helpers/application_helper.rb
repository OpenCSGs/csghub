module ApplicationHelper
  def current_cookie_domain
    if Rails.env != 'development'
      '.opencsg.com'
    else
      'localhost'
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
    (system_config.feature_flags rescue {}) || {}
  end
end

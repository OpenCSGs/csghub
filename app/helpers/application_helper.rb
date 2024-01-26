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
    (system_config.feature_flags rescue {}) || {}
  end

  def docs_url
    system_config = SystemConfig.first
    general_configs = (system_config.general_configs rescue {}) || {}
    general_configs['docs_url']

    def code_repo_owner_url owner
      if owner.is_a?(User)
        '/profile/' + owner.name
      else
        '/organizations/' + owner.name
      end
    end
  end
end 

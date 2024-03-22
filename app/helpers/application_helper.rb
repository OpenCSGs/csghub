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
  end

  def code_repo_owner_url owner
    if owner.is_a?(User)
      '/profile/' + owner.login_identity
    else
      '/organizations/' + owner.name
    end
  end

  def content_type_format_mapping
    {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'pdf': 'application/pdf',
      'md': 'text/markdown'
    }.with_indifferent_access
  end

  def default_meta_title
    'OpenCSG 传神社区'
  end

  def default_meta_description
    'OpenCSG 传神社区旨在打造一个开源的机器学习模型和数据集共享平台，为AI开发者提供灵活、易用的推理，训练，部署，体验服务，让大模型的应用更简单！'
  end

  def meta_title
    content_for(:meta_title) ||
    "<title>#{default_meta_title}</title>"
  end

  def meta_desc
    content_for(:meta_desc) ||
    "<meta name='description' content='#{default_meta_description}'>"
  end
end

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

  def starcloud_url
    system_config = SystemConfig.first
    general_configs = (system_config.general_configs rescue {}) || {}
    general_configs['starcloud_url']
  end

  def code_repo_owner_url owner
    if owner
      if owner.is_a?(User)
        '/profile/' + owner.name
      else
        '/organizations/' + owner.name
      end
    else
      '#'
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
    'OpenCSG 打造中国本土化 Huggingface plus 开源社区 开放传神 OpenCSG  传神社区 官网'
  end

  def default_meta_description
    'OpenCSG愿景： 让大模型赋能每一个人,大模型驱动全民，推动技术创新，OpenCSG——平台有各个领域的大模型，提供模型探索体验、推理、训练、部署和应用的一站式服务，共建模型开源社区，发现、学习、定制和分享心仪的模型。'
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

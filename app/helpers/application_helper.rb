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
end

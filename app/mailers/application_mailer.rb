class ApplicationMailer < ActionMailer::Base
  if Rails.env.production?
    default from: 'community@opencsg.com'
  else
    default from: 'feedback@opencsg.com'
  end

  layout "mailer"

  private

  def subject_prefix
    if ENV.fetch('RAILS_ENV', '') == 'production'
      "OpenCSG"
    else
      "测试(opencsg)"
    end
  end

  def default_mail_group
    [
      'pingl@opencsg.com',
      'lorraineg@opencsg.com',
      'echo.lv@opencsg.com',
      'schen@opencsg.com'
    ]
  end

  def internal_group
    system_config = SystemConfig.first
    mail_group = system_config.internal_mail_group rescue [ ]
    mail_group || default_mail_group
  end
end

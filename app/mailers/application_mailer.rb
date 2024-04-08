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

  def internal_group
    [
      'pingl@opencsg.com'
    ]
  end
end

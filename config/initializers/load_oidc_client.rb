ActiveSupport::Reloader.to_prepare do
  if ActiveRecord::Base.connection.data_source_exists?('system_configs')
    system_oidc_config = SystemConfig.first&.oidc_configs

    if system_oidc_config.present?
      OPENID_CLIENT = OpenIDConnect::Client.new(
        identifier: system_oidc_config['identifier'],
        secret: system_oidc_config['secret'],
        redirect_uri: system_oidc_config['redirect_uri'],
        authorization_endpoint: system_oidc_config['authorization_endpoint'],
        token_endpoint: system_oidc_config['token_endpoint'],
        userinfo_endpoint: system_oidc_config['userinfo_endpoint']
      )
    else
      default_oidc_config = Rails.application.credentials.oidc_config.send(Rails.env)
      OPENID_CLIENT = OpenIDConnect::Client.new(
        identifier: default_oidc_config['identifier'],
        secret: default_oidc_config['secret'],
        redirect_uri: default_oidc_config['redirect_uri'],
        authorization_endpoint: default_oidc_config['authorization_endpoint'],
        token_endpoint: default_oidc_config['token_endpoint'],
        userinfo_endpoint: default_oidc_config['userinfo_endpoint']
      )
    end
  end
end

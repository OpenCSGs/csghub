ActiveSupport::Reloader.to_prepare do
  if ActiveRecord::Base.connection.data_source_exists?('system_configs') && SystemConfig.first.present?
    oidc_configs = SystemConfig.first.oidc_configs

    OPENID_CLIENT = OpenIDConnect::Client.new(
      identifier: oidc_configs['identifier'],
      secret: oidc_configs['secret'],
      redirect_uri: oidc_configs['redirect_uri'],
      authorization_endpoint: oidc_configs['authorization_endpoint'],
      token_endpoint: oidc_configs['token_endpoint'],
      userinfo_endpoint: oidc_configs['userinfo_endpoint']
    )
  end
end
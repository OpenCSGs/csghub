class Oidc
  include Singleton

  def client
    OpenIDConnect::Client.new identifier: identifier,
                              secret: secret,
                              redirect_uri: redirect_uri,
                              authorization_endpoint: authorization_endpoint,
                              token_endpoint: token_endpoint,
                              userinfo_endpoint: userinfo_endpoint
  end

  def identifier
    ENV.fetch('OIDC_IDENTIFIER', nil) || oidc_configs['identifier']
  end

  def secret
    ENV.fetch('OIDC_SECRET', nil) || oidc_configs['secret']
  end

  def redirect_uri
    ENV.fetch('OIDC_REDIRECT_URI', nil) || oidc_configs['redirect_uri']
  end

  def authorization_endpoint
    ENV.fetch('OIDC_AUTHORIZATION_ENDPOINT', nil) || oidc_configs['authorization_endpoint']
  end

  def token_endpoint
    ENV.fetch('OIDC_TOKEN_ENDPOINT', nil) || oidc_configs['token_endpoint']
  end

  def userinfo_endpoint
    ENV.fetch('OIDC_USERINFO_ENDPOINT', nil) || oidc_configs['userinfo_endpoint']
  end

  def login_url
    ENV.fetch('LOGIN_URL', nil) || oidc_configs['login_url']
  end

  def signup_url
    ENV.fetch('SIGNUP_URL', nil) || oidc_configs['signup_url']
  end

  def oidc_configs
    @oidc_configs ||= load_oidc_configs
  end

  def load_oidc_configs
    default_configs = Rails.application.credentials.oidc_config.send(Rails.env)
    system_config = SystemConfig.first
    sc_conifgs = (system_config.oidc_configs rescue {}) || {}
    sc_conifgs.presence || default_configs
  end
end

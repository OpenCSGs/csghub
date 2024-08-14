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
    ENV.fetch('OIDC_IDENTIFIER', nil)
  end

  def secret
    ENV.fetch('OIDC_SECRET', nil)
  end

  def redirect_uri
    ENV.fetch('OIDC_REDIRECT_URI', nil)
  end

  def authorization_endpoint
    ENV.fetch('OIDC_AUTHORIZATION_ENDPOINT', nil)
  end

  def token_endpoint
    ENV.fetch('OIDC_TOKEN_ENDPOINT', nil)
  end

  def userinfo_endpoint
    ENV.fetch('OIDC_USERINFO_ENDPOINT', nil)
  end

  def login_url
    ENV.fetch('LOGIN_URL', nil)
  end

  def signup_url
    ENV.fetch('SIGNUP_URL', nil)
  end

  def oidc_configs
    @oidc_configs ||= load_oidc_configs
  end

  def load_oidc_configs
    Rails.application.credentials.oidc_config.send(Rails.env)
  end
end

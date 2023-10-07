class Authing
  include Singleton

  API_DOMAIN = "https://console.authing.cn"

  def get_access_token
    endpoint = '/api/v3/get-management-token'
    res = authing_connection.post(endpoint) do |req|
      req.body = {
                    accessKeyId: access_key,
                    accessKeySecret: access_secret
                  }.to_json
    end
    JSON.parse(res.body)["data"]["access_token"]
  end

  def update_userinfo options
    endpoint = '/api/v3/update-user'
    authing_connection.post(endpoint) do |req|
      req.headers['authorization'] = get_access_token
      req.headers['x-authing-userpool-id'] = access_key
      req.body = options.to_json
    end
  end

  def get_useinfo user_id
    endpoint = '/api/v3/get-user'
    res = authing_connection.get(endpoint) do |req|
      req.headers['authorization'] = get_access_token
      req.headers['x-authing-userpool-id'] = access_key
      req.params['userId'] = user_id
    end
    JSON.parse(res.body)["data"]
  end

  private

  def access_key
    Rails.application.credentials.authing_api.production.access_key
  end

  def access_secret
    Rails.application.credentials.authing_api.production.access_secret
  end

  def authing_connection
    Faraday.new(
      url: API_DOMAIN,
      headers: {'Content-Type' => 'application/json'}
    )
  end
end

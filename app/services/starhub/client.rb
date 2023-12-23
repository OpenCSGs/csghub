module Starhub
  class Client
    class ApiError < StandardError; end
    include Singleton

    API_VERSION = '/api/v1'

    def get(path, params = {})
      starhub_api_connection.get(request_path(path), params)
    rescue Faraday::ConnectionFailed
      raise StarhubError, "Git服务器超时"
    end

    def post(path, options = {})
      starhub_api_connection.post(request_path(path)) do |req|
        req.body = options.to_json
      end
    rescue Faraday::ConnectionFailed
      raise StarhubError, "Git服务器超时"
    end

    def put(path, options = {})
      starhub_api_connection.put(request_path(path)) do |req|
        req.body = options.to_json
      end
    rescue Faraday::ConnectionFailed
      raise StarhubError, "Git服务器超时"
    end

    def delete(path, params = {})
      starhub_api_connection.delete(request_path(path), params)
    rescue Faraday::ConnectionFailed
      raise StarhubError, "Git服务器超时"
    end

    private

    def starhub_configs
      system_config = SystemConfig.first
      starhub_configs = system_config.starhub_configs rescue {}
      base_url = starhub_configs['base_url'].presence || Rails.application.credentials.starhub_api.send("#{Rails.env}").base_url
      token = starhub_configs['token'].presence || Rails.application.credentials.starhub_api.send("#{Rails.env}").token
      [base_url, token]
    end
    
    def request_path(path)
      API_VERSION + path
    end

    def starhub_api_connection
      base_url, token = starhub_configs
      Faraday.new(
        url: base_url,
        headers: {
          'Content-Type' => 'application/json',
          'Authorization' => token
        })
    end
  end
end

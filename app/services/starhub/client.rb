module Starhub
  class Client
    class ApiError < StandardError; end

    include Singleton

    attr_accessor :user_ip

    def self.init_with user_ip
      instance.user_ip = user_ip
      instance
    end

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

    def upload(path, options = {})
      starhub_api_connection_upload.post(request_path(path)) do |req|
        req.body = options
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

    def delete(path, options = {})
      # 这个需要后续依赖后台的 API 进行重构
      starhub_api_connection.delete(request_path(path), options) do |req|
        req.body = options.to_json
      end
    rescue Faraday::ConnectionFailed
      raise StarhubError, "Git服务器超时"
    end

    def get_in_parallel(paths, params = {})
      responses = []
      starhub_api_connection.in_parallel do
        paths.map do |path|
          res = starhub_api_connection.get(request_path(path), params)
          raise StarhubError, res.body unless res.success?
          responses << res.body.force_encoding('UTF-8')
        end
      end
      responses
    rescue Faraday::ConnectionFailed
      raise StarhubError, "Git服务器超时"
    end

    private

    def starhub_configs
      env_base_url = ENV.fetch('STARHUB_BASE_URL', nil)
      env_token = ENV.fetch('STARHUB_TOKEN', nil)

      return [env_base_url, env_token] if env_base_url.present? && env_token.present?

      system_config = SystemConfig.first
      starhub_configs = system_config.starhub_configs rescue {}
      base_url = (starhub_configs && starhub_configs['base_url'].presence) || Rails.application.credentials.starhub_api.send("#{Rails.env}").base_url
      token = (starhub_configs && starhub_configs['token'].presence) || Rails.application.credentials.starhub_api.send("#{Rails.env}").token
      [base_url, token]
    end

    def request_path(path)
      API_VERSION + Addressable::URI.encode_component(path)
    end

    def starhub_api_connection
      base_url, token = starhub_configs
      # add this config to solve URL with unicode query
      Faraday::Utils.default_uri_parser = ->(uri) { Addressable::URI.parse(uri) }
      Faraday.new(
        request: {
          timeout: 2
        },
        url: base_url,
        headers: {
          'Content-Type' => 'application/json',
          'Authorization' => "Bearer #{token}",
          'X-Forwarded-For' => user_ip
      }) do |conn|
        conn.use Faraday::FollowRedirects::Middleware
        conn.adapter :typhoeus
      end
    end

    def starhub_api_connection_upload
      base_url, token = starhub_configs
      # add this config to solve URL with unicode query
      Faraday::Utils.default_uri_parser = ->(uri) { Addressable::URI.parse(uri) }
      Faraday.new(
        request: {
          timeout: 2
        },
        url: base_url,
        headers: {
          'Authorization' => "Bearer #{token}",
          'X-Forwarded-For' => user_ip
        }
      ) do |conn|
        conn.request :multipart, flat_encode: true
      end
    end
  end
end

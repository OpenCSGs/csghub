require 'rest_client'

module Starhub
  class Client
    class ApiError < StandardError; end

    include Singleton

    def get(path, options = {})
      request(:get, path, options)
    end

    def post(path, options = {})
      request(:post, path, options)
    end

    private

    def build_request_url(path)
      starhub_configs = SystemConfig.first&.starhub_configs
      base_url = starhub_configs.blank? ?  'http://localhost:8080/api/v1' : starhub_configs['base_url']
      base_url + path
    end

    def request(verb, path, options = {})
      headers = options[:headers] || {}
      headers['content-type'] ||= 'application/json'

      request = ::RestClient::Request.new(
        method: verb,
        url: build_request_url(path),
        headers: headers,
        payload: options[:body]
      )

      response = request.execute do |resp, &blk|
        if resp.code >= 300
          # TODO: handle more types of error
          raise APIError.new(resp)
        else 
          resp.return!(&blk)
        end
      end

      response.body
    end
  end
end

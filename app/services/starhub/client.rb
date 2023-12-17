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

    def delete(path, options = {})
      request(:delete, path, options)
    end

    private

    def build_request_url(path)
      base_url = Rails.application.credentials.starhub_api.send("#{Rails.env}").base_url
      base_url + path
    end

    def request(verb, path, options = {})
      headers = options[:headers] || {Authorization:"Bearer f3a7b9c1d6e5f8e2a1b5d4f9e6a2b8d7c3a4e2b1d9f6e7a8d2c5a7b4c1e3f5b8a1d4f9b7d6e2f8a5d3b1e7f9c6a8b2d1e4f7d5b6e9f2a4b3c8e1d7f995hd82hf"}
      headers['content-type'] ||= 'application/json'
      headers['Authorization'] ||= Rails.application.credentials.starhub_api.send("#{Rails.env}").token

      request = ::RestClient::Request.new(
        method: verb,
        url: build_request_url(path),
        headers: headers,
        payload: options[:body]
      )

      response = request.execute do |resp, &blk|
        if resp.code >= 300
          # TODO: handle more types of error
          raise ApiError.new(resp)
        else 
          resp.return!(&blk)
        end
      end

      response.body
    end
  end
end

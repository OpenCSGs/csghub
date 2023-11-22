require 'starhub/client'

module Starhub
  class Api
    def initialize
      @client = Starhub::Client.instance
    end

    def get_model_detail(username, model_name, options = {})
      res = @client.get("/api/v1/models/#{username}/#{model_name}/detail")
    end

    # TODO: add more starhub api
  end
end

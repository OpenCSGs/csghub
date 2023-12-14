require 'starhub/client'

module Starhub
  class Api
    def initialize
      @client = Starhub::Client.instance
    end

    def get_model_detail(username, model_name, options = {})
      res = @client.get("/models/#{username}/#{model_name}/detail")
    end

    def get_model_files(username, model_name, options = {})
      options[:path] ||= '/'
      res = @client.get("/models/#{username}/#{model_name}/tree?path=#{options[:path]}")
    end

    def get_last_commit(username, model_name, options = {})
      res = @client.get("/models/#{username}/#{model_name}/last_commit")
    end

    def get_model_branches(username, model_name, options = {})
      res = @client.get("/models/#{username}/#{model_name}/branches")
    end
    
    def create_sshkey(username, name, content)
      options = {}
      options[:body] = {
        username: username,
        name: name,
        content: content
      }
      @client.post("/user/deli6/ssh_keys", options)
    end

    # TODO: add more starhub api
  end
end

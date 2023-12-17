require 'starhub/client'

module Starhub
  class Api
    def initialize
      @client = Starhub::Client.instance
    end

    def get_model_detail(username, model_name, options = {})
      res = @client.get("/models/#{username}/#{model_name}/detail").body
    end

    def get_model_files(username, model_name, options = {})
      options[:path] ||= '/'
      res = @client.get("/models/#{username}/#{model_name}/tree?path=#{options[:path]}").body
    end

    def get_last_commit(username, model_name, options = {})
      res = @client.get("/models/#{username}/#{model_name}/last_commit").body
    end

    def get_model_branches(username, model_name, options = {})
      res = @client.get("/models/#{username}/#{model_name}/branches").body
    end

    def create_user(name, nickname, email)
      options = {
        username: name,
        name: nickname,
        email: email
      }
      @client.post("/users", options)
    end

    def update_user(name, nickname, email)
      options = {
        username: name,
        name: nickname,
        email: email
      }
      @client.put("/users/#{name}", options)
    end

    def create_model(username, model_name, namespace, options = {})
      options[:username] = username
      options[:name] = model_name
      options[:namespace] = namespace
      @client.post("/models", options)
    end

    def create_ssh_key(username, key_name, content)
      options = {
        username: username,
        name: key_name,
        content: content
      }
      @client.post("/user/#{username}/ssh_keys", options)
    end

    def create_organization(username, org_name, org_full_name, desc)
      options = {
        username: username,
        name: org_name,
        full_name: org_full_name,
        description: desc
      }
      @client.post("/organizations", options)
    end

    # TODO: add more starhub api
  end
end

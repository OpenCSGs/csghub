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

    def get_model_tags(username, model_name, options = {})
      res = @client.get("/models/#{username}/#{model_name}/tags")
    end

    # datasets
    def get_datasets_detail(username, dataset_name, options = {})
      res = @client.get("/datasets/#{username}/#{dataset_name}/detail")
    end

    def get_datasets_files(username, dataset_name, options = {})
      options[:path] ||= '/'
      res = @client.get("/datasets/#{username}/#{dataset_name}/tree?path=#{options[:path]}")
    end

    def get_datasets_commit(username, dataset_name, options = {})
      res = @client.get("/datasets/#{username}/#{dataset_name}/last_commit")
    end

    def get_datasets_branches(username, dataset_name, options = {})
      res = @client.get("/datasets/#{username}/#{dataset_name}/branches")
    end

    def get_datasets_tags(username, dataset_name, options = {})
      res = @client.get("/datasets/#{username}/#{dataset_name}/tags")
    end

    # TODO: add more starhub api
  end
end

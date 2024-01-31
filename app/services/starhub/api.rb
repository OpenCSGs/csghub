require 'starhub/client'

module Starhub
  class Api
    def initialize
      @client = Starhub::Client.instance
    end

    def get_model_detail_data_in_parallel(username, model_name, options = {})
      options[:path] ||= '/'
      options[:ref] ||= 'main'
      paths = [
        "/models/#{username}/#{model_name}/detail",
        "/models/#{username}/#{model_name}/tags",
        "/models/#{username}/#{model_name}/branches"
      ]
      @client.get_in_parallel(paths, options)
    end

    def get_model_detail_files_data_in_parallel(username, model_name, options = {})
      options[:path] ||= '/'
      options[:ref] ||= 'main'
      paths = [
        "/models/#{username}/#{model_name}/last_commit",
        "/models/#{username}/#{model_name}/tree?#{options[:path]}&ref=#{options[:ref]}"
      ]
      @client.get_in_parallel(paths, options)
    end

    def get_model_detail_blob_data_in_parallel(username, model_name, options = {})
      options[:path] ||= '/'
      options[:ref] ||= 'main'
      paths = [
        "/models/#{username}/#{model_name}/detail",
        "/models/#{username}/#{model_name}/tags",
        "/models/#{username}/#{model_name}/last_commit",
        "/models/#{username}/#{model_name}/branches",
        "/models/#{username}/#{model_name}/raw/#{options[:path]}?ref=#{options[:ref]}"
      ]
      @client.get_in_parallel(paths, options)
    end

    def get_models(current_user, keyword, sort_by, task_tag, framework_tag, license_tag, page=1, per=16)
      url = "/models?per=#{per}&page=#{page}"
      url += "&current_user=#{current_user}" if current_user.present?
      url += "&search=#{keyword}" if keyword.present?
      url += "&sort=#{sort_by}" if sort_by.present?
      url += "&task_tag=#{task_tag}" if task_tag.present?
      url += "&framework_tag=#{framework_tag}" if framework_tag.present?
      url += "&license_tag=#{license_tag}" if license_tag.present?
      res = @client.get(url)
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def get_model_detail(username, model_name, options = {})
      res = @client.get("/models/#{username}/#{model_name}/detail")
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def get_model_files(username, model_name, options = {})
      options[:path] ||= '/'
      res = @client.get("/models/#{username}/#{model_name}/tree?path=#{options[:path]}&ref=#{options[:ref]}")
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def get_model_last_commit(username, model_name, options = {})
      res = @client.get("/models/#{username}/#{model_name}/last_commit")
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def get_model_branches(username, model_name, options = {})
      res = @client.get("/models/#{username}/#{model_name}/branches")
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def get_model_file_content(username, model_name, path, options = {})
      res = @client.get("/models/#{username}/#{model_name}/raw/#{path}?ref=#{options[:ref]}")
      raise StarhubError, res.body unless res.success?
      res.body.force_encoding('UTF-8')
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

    def create_model(username, model_name, namespace, nickname, desc, options = {})
      options[:username] = username
      options[:name] = model_name
      options[:namespace] = namespace
      options[:nickname] = nickname
      options[:description] = desc
      @client.post("/models", options)
    end

    def delete_model(namespace, model_name, params = {})
      @client.delete("/models/#{namespace}/#{model_name}")
    end

    def update_model(username, model_name, namespace, nickname, desc, options = {})
      options[:username] = username
      options[:name] = model_name
      options[:nickname] = nickname
      options[:description] = desc
      res = @client.put("/models/#{namespace}/#{model_name}", options)
    end

    def create_dataset(username, dataset_name, namespace, nickname, desc, options = {})
      options[:username] = username
      options[:name] = dataset_name
      options[:namespace] = namespace
      options[:nickname] = nickname
      options[:description] = desc
      @client.post("/datasets", options)
    end

    def delete_dataset(namespace, dataset_name, params = {})
      @client.delete("/datasets/#{namespace}/#{dataset_name}")
    end

    def update_dataset(username, dataset_name, namespace, nickname, desc, options = {})
      options[:username] = username
      options[:name] = dataset_name
      options[:nickname] = nickname
      options[:description] = desc
      @client.put("/datasets/#{namespace}/#{dataset_name}", options)
    end

    def generate_git_token(username, name, options = {})
      options[:name] = name
      res = @client.post("/user/#{username}/tokens", options)
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def delete_git_token(username, token_name)
      @client.delete("/user/#{username}/tokens/#{token_name}")
    end

    def get_model_tags(username, model_name, options = {})
      res = @client.get("/models/#{username}/#{model_name}/tags")
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def get_user_models(namespace, username, options = {})
      res = @client.get("/user/#{namespace}/models?current_user=#{username}", options)
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def get_org_models(namespace, username, options = {})
      res = @client.get("/organization/#{namespace}/models?current_user=#{username}", options)
      raise StarhubError, res.body unless res.success?
      res.body.force_encoding('UTF-8')
    end

    def download_model_file(username, model_name, path, options = {})
      res = @client.get("/models/#{username}/#{model_name}/download/#{path}?ref=#{options[:ref]}&lfs=#{options[:lfs]}")
      raise StarhubError, res.body unless res.success?
      res.body
    end

    # datasets

    def get_dataset_detail_data_in_parallel(username, dataset_name, options = {})
      options[:path] ||= '/'
      options[:ref] ||= 'main'
      paths = [
        "/datasets/#{username}/#{dataset_name}/detail",
        "/datasets/#{username}/#{dataset_name}/tags",
        "/datasets/#{username}/#{dataset_name}/branches"
      ]
      @client.get_in_parallel(paths, options)
    end

    def get_dataset_detail_files_data_in_parallel(username, dataset_name, options = {})
      options[:path] ||= '/'
      options[:ref] ||= 'main'
      paths = [
        "/datasets/#{username}/#{dataset_name}/last_commit",
        "/datasets/#{username}/#{dataset_name}/tree?#{options[:path]}&ref=#{options[:ref]}"
      ]
      @client.get_in_parallel(paths, options)
    end

    def get_dataset_detail_blob_data_in_parallel(username, dataset_name, options = {})
      options[:ref] ||= 'main'
      paths = [
        "/datasets/#{username}/#{dataset_name}/detail",
        "/datasets/#{username}/#{dataset_name}/tags",
        "/datasets/#{username}/#{dataset_name}/last_commit",
        "/datasets/#{username}/#{dataset_name}/branches",
        "/datasets/#{username}/#{dataset_name}/raw/#{options[:path]}?ref=#{options[:ref]}"
      ]
      @client.get_in_parallel(paths, options)
    end

    def get_user_datasets(namespace, username, options = {})
      res = @client.get("/user/#{namespace}/datasets?current_user=#{username}", options)
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def get_org_datasets(namespace, username, options = {})
      res = @client.get("/organization/#{namespace}/datasets?current_user=#{username}", options)
      raise StarhubError, res.body unless res.success?
      res.body.force_encoding('UTF-8')
    end

    def get_datasets(current_user, keyword, sort_by, task_tag, framework_tag, license_tag, page=1, per=16)
      url = "/datasets?per=#{per}&page=#{page}"
      url += "&current_user=#{current_user}" if current_user.present?
      url += "&search=#{keyword}" if keyword.present?
      url += "&sort=#{sort_by}" if sort_by.present?
      url += "&task_tag=#{task_tag}" if task_tag.present?
      url += "&framework_tag=#{framework_tag}" if framework_tag.present?
      url += "&license_tag=#{license_tag}" if license_tag.present?
      res = @client.get(url)
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def get_datasets_detail(username, dataset_name, options = {})
      res = @client.get("/datasets/#{username}/#{dataset_name}/detail")
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def get_datasets_files(username, dataset_name, options = {})
      options[:path] ||= '/'
      res = @client.get("/datasets/#{username}/#{dataset_name}/tree?path=#{options[:path]}&ref=#{options[:ref]}")
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def get_datasets_last_commit(username, dataset_name, options = {})
      res = @client.get("/datasets/#{username}/#{dataset_name}/last_commit")
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def get_datasets_branches(username, dataset_name, options = {})
      res = @client.get("/datasets/#{username}/#{dataset_name}/branches")
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def get_datasets_tags(username, dataset_name, options = {})
      res = @client.get("/datasets/#{username}/#{dataset_name}/tags")
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def get_datasets_file_content(username, dataset_name, path, options = {})
      res = @client.get("/datasets/#{username}/#{dataset_name}/raw/#{path}?ref=#{options[:ref]}")
      raise StarhubError, res.body unless res.success?
      res.body.force_encoding('UTF-8')
    end

    def download_datasets_file(username, dataset_name, path, options = {})
      res = @client.get("/datasets/#{username}/#{dataset_name}/download/#{path}?ref=#{options[:ref]}")
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def create_ssh_key(username, key_name, content)
      options = {
        username: username,
        name: key_name,
        content: content
      }
      @client.post("/user/#{username}/ssh_keys", options)
    end

    def delete_ssh_key(username, key_name)
      options = {
        username: username,
        name: key_name
      }
      @client.delete("/user/#{username}/ssh_key/#{key_name}")
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

    def text_secure_check(scenario, content)
      return unless sensitive_check_enabled?
      return if content.blank?
      options = {
        scenario: scenario,
        text: content
      }
      res = @client.post("/sensitive/text", options)
      if res.status == 400
        raise SensitiveContentError, '监测到敏感内容'
      elsif res.status == 500
        raise StarhubError, "Git服务器报错"
      else
        res
      end
    end

    def image_secure_check(scenario, oss_bucket_name, oss_object_name)
      return unless sensitive_check_enabled?
      return if oss_object_name.blank?
      options = {
        scenario: scenario,
        oss_bucket_name: oss_bucket_name,
        oss_object_name: oss_object_name
      }
      res = @client.post("/sensitive/image", options)
      if res.status == 400
        raise SensitiveContentError, '监测到敏感内容'
      elsif res.status == 500
        raise StarhubError, "Git服务器报错"
      else
        res
      end
    end

    def create_membership(org_name, op_user, role, user)
      options = {
        op_user: op_user,
        role: role,
        user: user
      }
      @client.post("/organizations/#{org_name}/members", options)
    end

    def delete_membership(org_name, op_user, role, user)
      options = {
        op_user: op_user,
        role: role
      }
      @client.delete("/organizations/#{org_name}/members/#{user}", options)
    end

    # TODO: add more starhub api

    private

    def sensitive_check_enabled?
      config_from_env = ENV.fetch('SENSITIVE_CHECK', nil)
      system_config = SystemConfig.first
      feature_flags = (system_config.feature_flags rescue {}) || {}
      sensitive_check = config_from_env || feature_flags['sensitive_check']
      sensitive_check.to_s == 'true'
    end
  end
end

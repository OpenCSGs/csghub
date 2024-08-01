module Starhub
  module SharedRepoApis
    def get_repo_detail_data_in_parallel(repo_type, namespace, repo_name, options = {})
      options[:path] ||= '/'
      options[:ref] ||= 'main'
      paths = [
        "/#{repo_type}/#{namespace}/#{repo_name}?current_user=#{options[:current_user]}",
        "/#{repo_type}/#{namespace}/#{repo_name}/branches?current_user=#{options[:current_user]}"
      ]
      @client.get_in_parallel(paths, options)
    end

    def get_repo_detail_files_data_in_parallel(repo_type, namespace, repo_name, options = {})
      options[:path] ||= '/'
      options[:ref] ||= 'main'
      paths = [
        "/#{repo_type}/#{namespace}/#{repo_name}/last_commit?ref=#{options[:ref]}&current_user=#{options[:current_user]}",
        "/#{repo_type}/#{namespace}/#{repo_name}/tree?#{options[:path]}&ref=#{options[:ref]}&current_user=#{options[:current_user]}"
      ]
      @client.get_in_parallel(paths, options)
    end

    def get_repo_detail_blob_data_in_parallel(repo_type, namespace, repo_name, options = {})
      options[:path] ||= '/'
      options[:ref] ||= 'main'
      paths = [
        "/#{repo_type}/#{namespace}/#{repo_name}?current_user=#{options[:current_user]}",
        "/#{repo_type}/#{namespace}/#{repo_name}/last_commit?ref=#{options[:ref]}&current_user=#{options[:current_user]}",
        "/#{repo_type}/#{namespace}/#{repo_name}/branches?current_user=#{options[:current_user]}",
        "/#{repo_type}/#{namespace}/#{repo_name}/blob/#{options[:path]}?ref=#{options[:ref]}&current_user=#{options[:current_user]}"
      ]
      @client.get_in_parallel(paths, options)
    end

    def get_blob_sha(repo_type, namespace, repo_name, path, options = {})
      options[:path] ||= '/'
      res = @client.get("/#{repo_type}/#{namespace}/#{repo_name}/blob/#{path}?ref=#{options[:ref]}&current_user=#{options[:current_user]}")
      raise StarhubError, res.body unless res.success?
      res.body.force_encoding('UTF-8')
    end

    def get_repo_detail(repo_type, namespace, repo_name, options = {})
      res = @client.get("/#{repo_type}/#{namespace}/#{repo_name}", options)
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def get_repo_files(repo_type, namespace, repo_name, options = {})
      options[:path] ||= '/'
      res = @client.get("/#{repo_type}/#{namespace}/#{repo_name}/tree", options)
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def get_repo_last_commit(repo_type, namespace, repo_name, options = {})
      res = @client.get("/#{repo_type}/#{namespace}/#{repo_name}/last_commit", options)
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def get_repo_branches(repo_type, namespace, repo_name, options = {})
      res = @client.get("/#{repo_type}/#{namespace}/#{repo_name}/branches", options)
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def get_repo_file_content(repo_type, namespace, repo_name, path, options = {})
      res = @client.get("/#{repo_type}/#{namespace}/#{repo_name}/raw/#{path}", options)
      raise StarhubError, res.body unless res.success?
      res.body.force_encoding('UTF-8')
    end

    def create_repo(repo_type, username, repo_name, namespace, nickname, desc, options = {})
      options[:username] = username
      options[:name] = repo_name
      options[:namespace] = namespace
      options[:nickname] = nickname
      options[:description] = desc
      @client.post("/#{repo_type}?current_user=#{username}", options)
    end

    def update_repo(repo_type, username, repo_name, namespace, nickname, desc, options = {})
      options[:username] = username
      options[:name] = repo_name
      options[:nickname] = nickname
      options[:description] = desc
      @client.put("/#{repo_type}/#{namespace}/#{repo_name}?current_user=#{options[:current_user]}", options)
    end

    def get_repo_tags(repo_type, namespace, repo_name, options = {})
      res = @client.get("/#{repo_type}/#{namespace}/#{repo_name}/tags", options)
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def download_repo_resolve_file(repo_type, namespace, repo_name, path, options = {})
      res = @client.get("/#{repo_type}/#{namespace}/#{repo_name}/resolve/#{path}", options)
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def update_repo_file(repo_type, username, repo_name, path, options = {})
      @client.put("/#{repo_type}/#{username}/#{repo_name}/raw/#{path}?current_user=#{options[:username]}", options)
    end
  end
end

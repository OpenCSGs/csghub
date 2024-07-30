module Starhub
  module CodeApis
    def get_code_detail_data_in_parallel(namespace, code_name, options = {})
      get_repo_detail_data_in_parallel('codes', namespace, code_name, options)
    end

    def get_code_detail_files_data_in_parallel(namespace, code_name, options = {})
      get_repo_detail_files_data_in_parallel('codes', namespace, code_name, options)
    end

    def get_code_detail_blob_data_in_parallel(namespace, code_name, options = {})
      get_repo_detail_blob_data_in_parallel('codes', namespace, code_name, options)
    end

    def get_code_detail(namespace, code_name, options = {})
      get_repo_detail('codes', namespace, code_name, options)
    end

    def get_code_files(namespace, code_name, options = {})
      get_repo_files('codes', namespace, code_name, options)
    end

    def get_code_last_commit(namespace, code_name, options = {})
      get_repo_last_commit('codes', namespace, code_name, options)
    end

    def get_code_branches(namespace, code_name, options = {})
      get_repo_branches('codes', namespace, code_name, options)
    end

    def get_code_file_content(namespace, code_name, path, options = {})
      get_repo_file_content('codes', namespace, code_name, path, options)
    end

    def create_code(username, code_name, namespace, nickname, desc, options = {})
      create_repo('codes', username, code_name, namespace, nickname, desc, options)
    end

    def delete_code(namespace, code_name, params = {})
      delete_repo('codes', namespace, code_name, params)
    end

    def update_code(username, code_name, namespace, nickname, desc, options = {})
      update_repo('codes', username, code_name, namespace, nickname, desc, options)
    end

    def get_code_tags(namespace, code_name, options = {})
      get_repo_tags('codes', namespace, code_name, options)
    end

    def download_code_resolve_file(namespace, code_name, path, options = {})
      download_repo_resolve_file('codes', namespace, code_name, path, options)
    end

    def update_code_file(namespace, code_name, path, options = {})
      update_repo_file('codes', namespace, code_name, path, options)
    end

    def upload_code_file(namespace, code_name, options = {})
      upload_repo_file('codes', namespace, code_name, options)
    end

    def code_related_repos(namespace, code_name, options = {})
      related_repos('codes', namespace, code_name, options)
    end
  end
end

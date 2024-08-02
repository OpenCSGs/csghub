module Starhub
  module ModelApis
    def get_model_detail_data_in_parallel(namespace, model_name, options = {})
      get_repo_detail_data_in_parallel('models', namespace, model_name, options)
    end

    def get_model_detail_files_data_in_parallel(namespace, model_name, options = {})
      get_repo_detail_files_data_in_parallel('models', namespace, model_name, options)
    end

    def get_model_detail_blob_data_in_parallel(namespace, model_name, options = {})
      get_repo_detail_blob_data_in_parallel('models', namespace, model_name, options)
    end

    def get_model_detail(namespace, model_name, options = {})
      get_repo_detail('models', namespace, model_name, options)
    end

    def get_model_files(namespace, model_name, options = {})
      get_repo_files('models', namespace, model_name, options)
    end

    def get_model_blob(namespace, model_name, path, options = {})
      get_blob_sha('models', namespace, model_name, path, options)
    end

    def get_model_last_commit(namespace, model_name, options = {})
      get_repo_last_commit('models', namespace, model_name, options)
    end

    def get_model_branches(namespace, model_name, options = {})
      get_repo_branches('models', namespace, model_name, options)
    end

    def get_model_file_content(namespace, model_name, path, options = {})
      get_repo_file_content('models', namespace, model_name, path, options)
    end

    def create_model(username, model_name, namespace, nickname, desc, options = {})
      create_repo('models', username, model_name, namespace, nickname, desc, options)
    end

    def delete_model(namespace, model_name, params = {})
      delete_repo('models', namespace, model_name, params)
    end

    def update_model(username, model_name, namespace, nickname, desc, options = {})
      update_repo('models', username, model_name, namespace, nickname, desc, options)
    end

    def get_model_tags(namespace, model_name, options = {})
      get_repo_tags('models', namespace, model_name, options)
    end

    def download_model_resolve_file(namespace, model_name, path, options = {})
      download_repo_resolve_file('models', namespace, model_name, path, options)
    end

    def update_model_file(namespace, model_name, path, options = {})
      update_repo_file('models', namespace, model_name, path, options)
    end
  end
end

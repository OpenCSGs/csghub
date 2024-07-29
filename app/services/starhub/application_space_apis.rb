module Starhub
  module ApplicationSpaceApis
    def get_application_space_detail_data_in_parallel(namespace, application_space_name, options = {})
      get_repo_detail_data_in_parallel('spaces', namespace, application_space_name, options)
    end

    def get_application_space_detail_files_data_in_parallel(namespace, application_space_name, options = {})
      get_repo_detail_files_data_in_parallel('spaces', namespace, application_space_name, options)
    end

    def get_application_space_detail_blob_data_in_parallel(namespace, application_space_name, options = {})
      get_repo_detail_blob_data_in_parallel('spaces', namespace, application_space_name, options)
    end

    def get_application_space_detail(namespace, application_space_name, options = {})
      get_repo_detail('spaces', namespace, application_space_name, options)
    end

    def get_application_space_files(namespace, application_space_name, options = {})
      get_repo_files('spaces', namespace, application_space_name, options)
    end

    def get_application_space_last_commit(namespace, application_space_name, options = {})
      get_repo_last_commit('spaces', namespace, application_space_name, options)
    end

    def get_application_space_branches(namespace, application_space_name, options = {})
      get_repo_branches('spaces', namespace, application_space_name, options)
    end

    def get_application_space_file_content(namespace, application_space_name, path, options = {})
      get_repo_file_content('spaces', namespace, application_space_name, path, options)
    end

    def create_application_space(username, application_space_name, namespace, nickname, desc, options = {})
      create_repo('spaces', username, application_space_name, namespace, nickname, desc, options)
    end

    def update_application_space(username, application_space_name, namespace, nickname, desc, options = {})
      update_repo('spaces', username, application_space_name, namespace, nickname, desc, options)
    end

    def get_application_space_tags(namespace, application_space_name, options = {})
      get_repo_tags('spaces', namespace, application_space_name, options)
    end

    def download_application_space_file(namespace, application_space_name, path, options = {})
      download_repo_file('spaces', namespace, application_space_name, path, options)
    end

    def download_application_space_resolve_file(namespace, application_space_name, path, options = {})
      download_repo_resolve_file('spaces', namespace, application_space_name, path, options)
    end

    def update_application_space_file(namespace, application_space_name, path, options = {})
      update_repo_file('spaces', namespace, application_space_name, path, options)
    end
  end
end

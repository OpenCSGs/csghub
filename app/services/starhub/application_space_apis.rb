module Starhub
  module ApplicationSpaceApis
    def get_application_space_detail_data_in_parallel(namespace, application_space_name, options = {})
      get_repo_detail_data_in_parallel('application_spaces', namespace, application_space_name, options)
    end

    def get_application_space_detail_files_data_in_parallel(namespace, application_space_name, options = {})
      get_repo_detail_files_data_in_parallel('application_spaces', namespace, application_space_name, options)
    end

    def get_application_space_detail_blob_data_in_parallel(namespace, application_space_name, options = {})
      get_repo_detail_blob_data_in_parallel('application_spaces', namespace, application_space_name, options)
    end

    def get_application_spaces(current_user, keyword, sort_by, task_tag, framework_tag, license_tag, page = 1, per = 16)
      get_repos('application_spaces', current_user, keyword, sort_by, task_tag, framework_tag, license_tag, page, per)
    end

    def get_application_space_detail(namespace, application_space_name, options = {})
      get_repo_detail('application_spaces', namespace, application_space_name, options)
    end

    def get_application_space_files(namespace, application_space_name, options = {})
      get_repo_files('application_spaces', namespace, application_space_name, options)
    end

    def get_application_space_last_commit(namespace, application_space_name, options = {})
      get_repo_last_commit('application_spaces', namespace, application_space_name, options)
    end

    def get_application_space_branches(namespace, application_space_name, options = {})
      get_repo_branches('application_spaces', namespace, application_space_name, options)
    end

    def get_application_space_file_content(namespace, application_space_name, path, options = {})
      get_repo_file_content('application_spaces', namespace, application_space_name, path, options)
    end

    def create_application_space(username, application_space_name, namespace, nickname, desc, options = {})
      create_repo('application_spaces', username, application_space_name, namespace, nickname, desc, options)
    end

    def delete_application_space(namespace, application_space_name, params = {})
      delete_repo('application_spaces', namespace, application_space_name, params)
    end

    def update_application_space(username, application_space_name, namespace, nickname, desc, options = {})
      update_repo('application_spaces', username, application_space_name, namespace, nickname, desc, options)
    end

    def get_application_space_tags(namespace, application_space_name, options = {})
      get_repo_tags('application_spaces', namespace, application_space_name, options)
    end

    def download_application_space_file(namespace, application_space_name, path, options = {})
      download_repo_file('application_spaces', namespace, application_space_name, path, options)
    end

    def download_application_space_resolve_file(namespace, application_space_name, path, options = {})
      download_repo_resolve_file('application_spaces', namespace, application_space_name, path, options)
    end

    def create_application_space_file(namespace, application_space_name, path, options = {})
      create_repo_file('application_spaces', namespace, application_space_name, path, options)
    end

    def update_application_space_file(namespace, application_space_name, path, options = {})
      update_repo_file('application_spaces', namespace, application_space_name, path, options)
    end

    def upload_application_space_file(namespace, application_space_name, options = {})
      upload_repo_file('application_spaces', namespace, application_space_name, options)
    end
  end
end

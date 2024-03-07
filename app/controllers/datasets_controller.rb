class DatasetsController < ApplicationController
  include TagListHelper
  include LicenseListHelper
  include LocalRepoValidation
  include FileOptionsHelper

  layout 'new_application'

  before_action :check_user_info_integrity
  before_action :authenticate_user, only: [:new_file, :upload_file]
  before_action :load_branch_and_path, only: [:files, :blob, :new_file, :upload_file]
  before_action :load_dataset_detail, only: [:show, :files, :blob, :new_file, :upload_file]

  def index
    get_tag_list('dataset')
  end

  def new
    @available_namespaces = current_user.available_namespaces
    get_license_list
  end

  def show
    @default_tab = 'summary'
  end

  def files
    render :show
  end

  def blob
    if params[:download] == 'true'
      if params[:lfs] == 'true'
        file_url = Starhub.api.download_datasets_file(params[:namespace],
                                                      params[:dataset_name],
                                                      params[:lfs_path],
                                                      { ref: @current_branch,
                                                        lfs: true,
                                                        save_as: params[:path] })
        redirect_to JSON.parse(file_url)['data'], allow_other_host: true
      else
        file = Starhub.api.download_datasets_file(params[:namespace],
                                                  params[:dataset_name],
                                                  params[:path],
                                                  { ref: @current_branch })
        send_data file, filename: params[:path].split('/').last
      end
    else
      render :show
    end
  end

  def upload_file
    render :show
  end

  def new_file
    render :show
  end

  private

  def load_dataset_detail
    local_repo_validation('dataset')

    return if action_name == 'blob' && params[:download] == 'true'

    if action_name == 'blob'
      @dataset, @last_commit, @branches, @content = Starhub.api.get_dataset_detail_blob_data_in_parallel(params[:namespace], params[:dataset_name], files_options)
    else
      @dataset, @branches = Starhub.api.get_dataset_detail_data_in_parallel(params[:namespace], params[:dataset_name], files_options)
    end
    @tags = Tag.build_detail_tags(JSON.parse(@dataset)['data']['tags']).to_json
    @settings_visibility = current_user ? current_user.can_manage?(@local_dataset) : false
  end
end

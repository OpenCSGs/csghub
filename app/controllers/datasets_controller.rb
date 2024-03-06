class DatasetsController < ApplicationController
  include TagListHelper
  include LicenseListHelper

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
    owner = User.find_by(name: params[:namespace]) || Organization.find_by(name: params[:namespace])
    @local_dataset = owner && owner.datasets.find_by(name: params[:dataset_name])
    unless @local_dataset
      return redirect_to errors_not_found_path
    end
    @owner_url = helpers.code_repo_owner_url owner
    if @local_dataset.dataset_private?
      if @local_dataset.owner.instance_of? User
        return redirect_to errors_unauthorized_path if @local_dataset.owner != current_user
      else
        return redirect_to errors_unauthorized_path unless current_user.org_role(@local_dataset.owner)
      end
    end

    return if action_name == 'blob' && params[:download] == 'true'

    @avatar_url = owner.avatar_url

    if action_name == 'blob'
      @dataset, @last_commit, @branches, @content = Starhub.api.get_dataset_detail_blob_data_in_parallel(params[:namespace], params[:dataset_name], files_options)
    else
      @dataset, @branches = Starhub.api.get_dataset_detail_data_in_parallel(params[:namespace], params[:dataset_name], files_options)
    end
    @tags = Tag.build_detail_tags(JSON.parse(@dataset)['data']['tags']).to_json
    @settings_visibility = current_user ? current_user.can_manage?(@local_dataset) : false
  end

  def load_branch_and_path
    @default_tab = 'files'
    @current_branch = params[:branch] || 'main'
    @current_path = params[:path] || ''
  end

  def files_options
    {
      ref: @current_branch,
      path: @current_path,
      current_user: current_user&.name
    }
  end
end

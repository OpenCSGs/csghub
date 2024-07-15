class ModelsController < ApplicationController
  layout 'repo_application'

  include TagListHelper
  include LicenseListHelper
  include LocalRepoValidation
  include FileOptionsHelper
  include BlobContentHelper

  before_action :check_user_info_integrity
  before_action :authenticate_user, only: [:new, :new_file, :upload_file, :edit_file, :settings]
  before_action :load_branch_and_path, except: [:index, :new]
  before_action :load_model_detail, except: [:index, :new, :resolve]

  def index
    get_tag_list('models')
  end

  def new
    @available_namespaces = current_user.available_namespaces
    get_license_list
  end

  def show
    @default_tab = 'summary'
  end

  def files
    @default_tab = 'files'
    render :show
  end

  def community
    @default_tab = 'community'
    render :show
  end

  def settings
    @default_tab = 'settings'
    render :show
  end

  def blob
    @default_tab = 'files'
    render :show
  end

  def resolve
    if params[:download] == 'true'
      if params[:lfs] == 'true'
        file_url = csghub_api.download_model_file(params[:namespace],
                                                   params[:model_name],
                                                   params[:lfs_path],
                                                   { ref: @current_branch,
                                                     lfs: true,
                                                     save_as: @current_path,
                                                     current_user: current_user&.name })
        redirect_to JSON.parse(file_url)['data'], allow_other_host: true
      else
        file = csghub_api.download_model_file(params[:namespace],
                                               params[:model_name],
                                               @current_path,
                                               { ref: @current_branch,
                                                 current_user: current_user&.name })
        send_data file, filename: @current_path
      end
    else
      content_type = helpers.content_type_format_mapping[params[:format]] || 'text/plain'
      if ['jpg', 'png', 'jpeg', 'gif', 'svg'].include? params[:format]
        result = csghub_api.download_model_resolve_file(params[:namespace],
                                                         params[:model_name],
                                                         @current_path,
                                                         { ref: @current_branch,
                                                           current_user: current_user&.name })
        send_data result, type: content_type, disposition: 'inline'
      else
        result = csghub_api.get_model_file_content(params[:namespace],
                                                    params[:model_name],
                                                    @current_path,
                                                    { ref: @current_branch,
                                                      current_user: current_user&.name })
        render plain: JSON.parse(result)['data']
      end
    end
  end

  def upload_file
    @default_tab = 'files'
    render :show
  end

  def new_file
    @default_tab = 'files'
    render :show
  end

  def edit_file
    @default_tab = 'files'
    render :show
  end

  def commits
    @default_tab = 'files'
    render :show
  end

  def commit
    @default_tab = 'files'
    @commit_id = params[:commit_id]
    render :show
  end

  private

  def load_model_detail
    return if action_name == 'blob' && params[:download] == 'true'

    if action_name == 'blob' || action_name == 'edit_file'
      @model, @last_commit, @branches, @blob = csghub_api.get_model_detail_blob_data_in_parallel(params[:namespace], params[:model_name], files_options)
      update_blob_content('model')
    else
      @model, @branches = csghub_api.get_model_detail_data_in_parallel(params[:namespace], params[:model_name], files_options)
    end
    @tags_list = Tag.where(scope: 'model', tag_type: 'task').as_json
    @tags = Tag.build_detail_tags(JSON.parse(@model)['data']['tags'], 'model').to_json
    @settings_visibility = (current_user && @local_model) ? current_user.can_manage?(@local_model) : false
  end
end

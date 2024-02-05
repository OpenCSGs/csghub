class ModelsController < ApplicationController
  layout 'new_application'

  before_action :check_user_info_integrity
  before_action :authenticate_user, only: [:new_file]
  before_action :load_branch_and_path, only: [:files, :blob, :new_file]
  before_action :load_model_detail, only: [:show, :files, :blob, :new_file]

  def index
    response = {}
    Tag::MODEL_TAG_FIELDS.each do |field|
      response[field] = {}
      response[field][:color] = Tag::TAG_FIELD_COLOR_MAPPINGS[field][:color]
      response[field][:zh_name] = Tag::TAG_FIELD_COLOR_MAPPINGS[field][:zh_name]
      response[field][:tags] = Tag.where(tag_field: field, scope: 'model')
    end
    @task_tags = response.as_json
    @framework_tags = Tag.where(tag_type: 'framework').as_json
    @license_tags = Tag.where(tag_type: 'license').order(weight: :asc).as_json
  end

  def new
    @available_namespaces = current_user.available_namespaces
    system_config = SystemConfig.first
    license_configs = system_config.license_configs rescue nil
    @licenses = license_configs.presence || Model::DEFAULT_LICENSES
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
        file_url = Starhub.api.download_model_file(params[:namespace],
                                                   params[:model_name],
                                                   params[:lfs_path],
                                                   { ref: @current_branch,
                                                     lfs: true })
        redirect_to JSON.parse(file_url)['data'], allow_other_host: true
      else
        file = Starhub.api.download_model_file(params[:namespace],
                                               params[:model_name],
                                               params[:path],
                                               { ref: @current_branch })
        send_data file, filename: params[:path].split('/').last
      end
    else
      render :show
    end
  end

  def new_file
    render :show
  end

  private

  def load_model_detail
    owner = User.find_by(name: params[:namespace]) || Organization.find_by(name: params[:namespace])
    @local_model = owner && owner.models.find_by(name: params[:model_name])
    unless @local_model
      return redirect_to errors_not_found_path
    end
    @owner_url = helpers.code_repo_owner_url owner
    if @local_model.model_private?
      if @local_model.owner.instance_of? User
        return redirect_to errors_unauthorized_path if @local_model.owner != current_user
      else
        return redirect_to errors_unauthorized_path unless current_user.org_role(@local_model.owner)
      end
    end

    return if action_name == 'blob' && params[:download] == 'true'

    @avatar_url = owner.avatar_url
    if action_name == 'blob'
      @model, raw_tags, @last_commit, @branches, @content = Starhub.api.get_model_detail_blob_data_in_parallel(params[:namespace], params[:model_name], files_options)
    else
      @model, raw_tags, @branches = Starhub.api.get_model_detail_data_in_parallel(params[:namespace], params[:model_name], files_options)
    end
    @tags = Tag.build_detail_tags(JSON.parse(raw_tags)['data']).to_json
    @settings_visibility = current_user ? current_user.can_manage?(@local_model) : false
  end

  def load_branch_and_path
    @default_tab = 'files'
    @current_branch = params[:branch] || 'main'
    @current_path = params[:path] || ''
  end

  def files_options
    {
      ref: @current_branch,
      path: @current_path
    }
  end
end

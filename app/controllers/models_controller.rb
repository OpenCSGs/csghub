class ModelsController < ApplicationController
  layout 'new_application'

  before_action :check_user_info_integrity
  before_action :load_branch_and_path, only: [:files, :blob]
  before_action :load_model_detail, only: [:show, :files, :blob]

  def index
    response = {}
    Tag::MODEL_TAG_FIELDS.each do |field|
      response[field] = {}
      response[field][:color] = Tag::TAG_FIELD_COLOR_MAPPINGS[field][:color]
      response[field][:zh_name] = Tag::TAG_FIELD_COLOR_MAPPINGS[field][:zh_name]
      response[field][:tags] = Tag.where(tag_field: field)
    end
    @task_tags = response.as_json
    @framework_tags = Tag.where(tag_type: 'framework').as_json
    tag_other = Tag.where(tag_type: 'license', name: 'other').first
    tags = Tag.where(tag_type: 'license').where.not(name: 'other').order(name: :asc).to_a
    @license_tags = (tags << tag_other).as_json
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
      file = Starhub.api.download_model_file(params[:namespace], params[:model_name], params[:path], { ref: @current_branch })
      send_data file, filename: params[:path].split('/').last
    else
      render :show
    end
  end

  private

  def load_model_detail
    owner = User.find_by(name: params[:namespace]) || Organization.find_by(name: params[:namespace])
    @local_model = owner && owner.models.find_by(name: params[:model_name])
    unless @local_model
      # ToDo: 在模型列表页渲染 alert message
      flash[:alert] = "未找到模型"
      return redirect_to "/models"
    end
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
      @model, raw_tags, @last_commit, @branches, @readme, @content = Starhub.api.get_model_detail_blob_data_in_parallel(params[:namespace], params[:model_name], files_options)
    else
      @model, raw_tags, @last_commit, @branches, @readme, @files = Starhub.api.get_model_detail_files_data_in_parallel(params[:namespace], params[:model_name], files_options)
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

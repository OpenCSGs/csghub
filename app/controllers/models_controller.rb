class ModelsController < ApplicationController
  before_action :check_user_info_integrity
  before_action :load_model_detail, only: [:show, :files]

  def index
  end

  def new_index
    response = {}
    Tag::MODEL_TAG_FIELDS.each do |field|
      response[field] = {}
      response[field][:color] = Tag::TAG_FIELD_COLOR_MAPPINGS[field][:color]
      response[field][:zh_name] = Tag::TAG_FIELD_COLOR_MAPPINGS[field][:zh_name]
      response[field][:tags] = Tag.where(tag_field: field)
    end
    @task_tags = response.as_json
    @framework_tags = Tag.where(tag_type: 'framework').as_json
    @license_tags = Tag.where(tag_type: 'license').as_json
  end

  def show
    @default_tab = 'summary'
    owner = User.find_by(name: params[:namespace]) || Organization.find_by(name: params[:namespace])
    @local_model = owner && owner.models.find_by(name: params[:model_name])
    unless @local_model
      # ToDo: 在模型列表页渲染 alert message
      flash[:alert] = "未找到模型"
      return redirect_to "/models"
    end
    @files = Starhub.api.get_model_files(params[:namespace], params[:model_name])
  end

  def files
    owner = User.find_by(name: params[:namespace]) || Organization.find_by(name: params[:namespace])
    @local_model = owner && owner.models.find_by(name: params[:model_name])
    unless @local_model
      # ToDo: 在模型列表页渲染 alert message
      flash[:alert] = "未找到模型"
      return redirect_to "/models"
    end
    @default_tab = 'files'
    @current_branch = params[:branch] || 'main'
    @current_path = params[:path] || ''
    @files = Starhub.api.get_model_files(params[:namespace], params[:model_name], files_options)
    render :show
  end

  def new
    @available_namespaces = current_user.available_namespaces
    system_config = SystemConfig.first
    license_configs = system_config.license_configs rescue nil
    @licenses = license_configs.presence || Model::DEFAULT_LICENSES
  end

  private

  def load_model_detail
    @model = Starhub.api.get_model_detail(params[:namespace], params[:model_name])
    @last_commit = Starhub.api.get_model_last_commit(params[:namespace], params[:model_name])
    @branches = Starhub.api.get_model_branches(params[:namespace], params[:model_name])
    @readme = Starhub.api.get_model_file_content(params[:namespace], params[:model_name], 'README.md')
  end

  def files_options
    {
      ref: @current_branch,
      path: @current_path
    }
  end
end

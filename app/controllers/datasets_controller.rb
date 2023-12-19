class DatasetsController < ApplicationController
  before_action :check_user_info_integrity

  def index
  end

  def show
    owner = User.find_by(name: params[:user_name]) || Organization.find_by(name: params[:user_name])
    @local_dataset = owner && owner.datasets.find_by(name: params[:dataset_name])
    unless @local_dataset
      # ToDo: 在模型列表页渲染 alert message
      flash[:alert] = "未找到数据集"
      return redirect_to "/datasets"
    end

    @dataset = Starhub.api.get_datasets_detail(params[:user_name], params[:dataset_name])
    @files = Starhub.api.get_datasets_files(params[:user_name], params[:dataset_name])
    @last_commit = Starhub.api.get_datasets_last_commit(params[:user_name], params[:dataset_name])
    @branches = Starhub.api.get_datasets_branches(params[:user_name], params[:dataset_name])
  end

  def new_index
    response = {}
    Tag::DATASET_TAG_FIELDS.each do |field|
      response[field] = {}
      response[field][:color] = Tag::TAG_FIELD_COLOR_MAPPINGS[field][:color]
      response[field][:zh_name] = Tag::TAG_FIELD_COLOR_MAPPINGS[field][:zh_name]
      response[field][:tags] = Tag.where(tag_field: field)
    end
    @task_tags = response.as_json
    @framework_tags = Tag.where(tag_type: 'framework').as_json
    @license_tags = Tag.where(tag_type: 'license').as_json
  end

  def new
    @available_namespaces = current_user.available_namespaces
    system_config = SystemConfig.first
    license_configs = system_config.license_configs rescue nil
    @licenses = license_configs.presence || Model::DEFAULT_LICENSES
  end
end

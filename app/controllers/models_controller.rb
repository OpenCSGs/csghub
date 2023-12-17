class ModelsController < ApplicationController
  before_action :check_user_info_integrity

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
  end

  def show
    @model = Starhub.api.get_model_detail(params[:user_name], params[:model_name])
    @files = Starhub.api.get_model_files(params[:user_name], params[:model_name])
    @last_commit = Starhub.api.get_last_commit(params[:user_name], params[:model_name])
    @branches = Starhub.api.get_model_branches(params[:user_name], params[:model_name])
  end

  def destroy
    begin
      Starhub.api.delete_model(params[:user_name], params[:model_name])
      render json: { message: '删除成功' }
    rescue Starhub::Client::ApiError => e
      puts "Caught an internal server error: #{e.message}"
      return render json: { message: "删除#{params[:user_name]}/#{params[:model_name]}失败" }, status: :bad_request
    end
  end

  def new
    @available_namespaces = current_user.available_namespaces
    system_config = SystemConfig.first
    license_configs = system_config.license_configs rescue nil
    @licenses = license_configs.presence || Model::DEFAULT_LICENSES
  end
end

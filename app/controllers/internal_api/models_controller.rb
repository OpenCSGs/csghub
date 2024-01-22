class InternalApi::ModelsController < InternalApi::ApplicationController
  before_action :authenticate_user, except: [:index, :files]
  before_action :validate_authorization, only: :files

  def index
    res_body = Starhub.api.get_models(current_user&.name,
                                      params[:search],
                                      params[:sort],
                                      params[:task_tag],
                                      params[:framework_tag],
                                      params[:license_tag],
                                      params[:page],
                                      params[:per_page])
    api_response = JSON.parse(res_body)
    render json: {models: api_response['data'], total: api_response['total']}
  end

  def files
    last_commit, files = Starhub.api.get_model_detail_files_data_in_parallel(params[:namespace], params[:model_name], files_options)
    render json: { last_commit: JSON.parse(last_commit)['data'], files: JSON.parse(files)['data'] }
  end

  def create
    res = validate_owner
    if !res[:valid]
      return render json: { message: res[:message] }, status: :unprocessable_entity
    end
    model = current_user.created_models.build(model_params)
    if model.save
      render json: { path: model.path, message: '模型创建成功!' }, status: :created
    else
      render json: { message: model.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update
    owner = User.find_by(name: params[:namespace]) || Organization.find_by(name: params[:namespace])
    @model = owner && owner.models.find_by(name: params[:model_name])

    unless @model
      return render json: { message: "未找到对应模型" }, status: 404
    end

    unless current_user.can_manage?(@model)
      render json: { message: '无权限' }, status: :unauthorized
      return
    end

    if params[:private].to_s == 'true'
      @model.visibility = 'private'
    else
      @model.visibility = 'public'
    end

    if @model.save
      render json: { message: '更新成功' }
    else
      render json: { message: "更新失败" }, status: :bad_request
    end
  end

  def destroy
    owner = User.find_by(name: params[:namespace]) || Organization.find_by(name: params[:namespace])
    @model = owner && owner.models.find_by(name: params[:model_name])

    unless @model
      return render json: { message: "未找到对应模型" }, status: 404
    end

    unless current_user.can_manage?(@model)
      render json: { message: '无权限' }, status: :unauthorized
      return
    end

    if @model.destroy
      render json: { message: '删除成功' }
    else
      render json: { message: "删除 #{params[:namespace]}/#{params[:model_name]} 失败" }, status: :bad_request
    end
  end

  private

  def model_params
    params.permit(:name, :owner_id, :owner_type, :visibility, :license)
  end

  def validate_owner
    if params[:owner_type] == 'User' && current_user.id.to_i != params[:owner_id].to_i
      return { valid: false, message: '用户不存在' }
    elsif params[:owner_type] == 'Organization'
      org = current_user.organizations.find_by(id: params[:owner_id])
      if !org || current_user.org_role(org) == 'read'
        return { valid: false, message: '组织不存在或无权限' }
      end
    end
    { valid: true }
  end

  def files_options
    {
      ref: params[:branch],
      path: params[:path]
    }
  end

  def validate_authorization
    owner = find_user_or_organization_by_name(params[:namespace])
    local_model = find_model_by_owner_and_name(owner, params[:model_name])

    return render_unauthorized('模型不存在') unless local_model

    return render_unauthorized('无权限') unless valid_authorization?(local_model)
  end

  def find_user_or_organization_by_name(name)
    User.find_by(name: name) || Organization.find_by(name: name)
  end

  def find_model_by_owner_and_name(owner, model_name)
    owner&.models&.find_by(name: model_name)
  end

  def valid_authorization?(model)
    return true unless model.model_private?

    return false unless current_user

    if model.owner.instance_of?(User)
      return model.owner == current_user
    end

    return current_user.org_role(model.owner)
  end

  def render_unauthorized(message)
    render json: { message: message }, status: :unauthorized
  end
end

class InternalApi::ModelsController < InternalApi::ApplicationController
  before_action :authenticate_user

  def index
    page = params[:page] || 1
    per_page = params[:per_page] || 16
    res_body = Starhub.api.get_models(page, per_page)
    api_response = JSON.parse(res_body)
    render json: {models: api_response['data'], total: api_response['total']}
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
      render json: { message: '模型创建失败!' }, status: :unprocessable_entity
    end
  end

  def update
    owner = User.find_by(name: params[:namespace]) || Organization.find_by(name: params[:namespace])
    @model = owner && owner.models.find_by(name: params[:model_name])

    unless @model
      return render json: { message: "未找到对应模型" }, status: 404
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
end

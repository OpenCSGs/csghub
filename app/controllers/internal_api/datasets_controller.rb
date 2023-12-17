class InternalApi::DatasetsController < ApplicationController
  before_action :authenticate_user

  def create
    res = validate_owner
    if !res[:valid]
      return render json: { message: res[:message] }, status: :unprocessable_entity
    end
    dataset = current_user.created_datasets.build(dataset_params)
    if dataset.save
      render json: { path: dataset.path, message: '数据集创建成功!' }, status: :created
    else
      render json: { message: '数据集创建失败!' }, status: :unprocessable_entity
    end
  end

  private

  def dataset_params
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

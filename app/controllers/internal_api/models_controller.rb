class InternalApi::ModelsController < ApplicationController
  before_action :authenticate_user
  
  def create
    model = current_user.created_models.build(model_params)
    if model.save
      render json: { path: model.path, message: '模型创建成功!' }, status: :created
    else
      render json: { message: '模型创建失败!' }, status: :unprocessable_entity
    end
  end

  private

  def model_params
    params.permit(:name, :owner_id, :owner_type, :visibility, :license)
  end
end

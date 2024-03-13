class InternalApi::CodesController < InternalApi::ApplicationController
  before_action :authenticate_user

  def create
    code = current_user.created_codes.build(code_params)
    if code.save
      render json: { path: code.path, message: '代码仓库创建成功!' }, status: :created
    else
      render json: { message: code.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  private

  def code_params
    params.permit(:name, :nickname, :desc, :owner_id, :owner_type, :visibility, :license)
  end
end

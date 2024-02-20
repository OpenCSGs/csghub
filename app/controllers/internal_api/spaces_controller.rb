class InternalApi::SpacesController < InternalApi::ApplicationController
  before_action :authenticate_user

  def create
    res = validate_owner
    if !res[:valid]
      return render json: { message: res[:message] }, status: :unprocessable_entity
    end
    model = current_user.created_models.build(create_params)
    if model.save
      render json: { path: model.path, message: '模型创建成功!' }, status: :created
    else
      render json: { message: model.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
    puts "success!!!!"
    render json: { message: "创建成功" }
  end

  private

  def create_params
    params.permit(:name, :nickname, :desc, :owner_id, :owner_type, :visibility, :license)
  end
end

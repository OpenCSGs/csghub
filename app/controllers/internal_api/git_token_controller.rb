class InternalApi::GitTokenController < InternalApi::ApplicationController
  def create
    res_body = Starhub.api.generate_git_token(current_user.name, params[:name])
    res_json = JSON.parse(res_body)
    current_user.git_token = res_json["data"]["token"]
    if current_user.save
      render json: { message: '添加成功' }
    else
      render json: { message: '生成 Git Token 失败' }, status: :bad_request
    end
  end

  private

  def create_params
    params.permit(:name)
  end
end

class InternalApi::GitTokenController < InternalApi::ApplicationController
  before_action :authenticate_user

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

  def refresh
    if current_user.git_token_name.present? && current_user.git_token.present?
      Starhub.api.delete_git_token(current_user.name, current_user.git_token_name)
    end
    random_name = SecureRandom.uuid
    res_body = Starhub.api.generate_git_token(current_user.name, random_name)
    res_json = JSON.parse(res_body)
    current_user.git_token_name = res_json["data"]["name"]
    current_user.git_token = res_json["data"]["token"]
    if current_user.save
      render json: { token: current_user.git_token, message: '刷新 Git Token 成功' }
    else
      render json: { message: '刷新 Git Token 失败' }, status: :bad_request
    end
  end

  private

  def create_params
    params.permit(:name)
  end
end

class InternalApi::AccessTokenController < InternalApi::ApplicationController
  before_action :authenticate_user

  def refresh
    if current_user.git_token_name.present? && current_user.git_token.present?
      csghub_api.delete_git_token(current_user.name, current_user.git_token_name, current_user.name)
    end
    random_name = SecureRandom.uuid
    res_body = csghub_api.generate_git_token(current_user.name, random_name)
    res_json = JSON.parse(res_body)

    token_name = res_json.dig("data", "name")
    token = res_json.dig("data", "token")

    if token.present? && token_name.present?
      current_user.update_columns(git_token_name: token_name,
                                  git_token: token)
      render json: { token: current_user.git_token, message: '刷新 Git Token 成功' }
    else
      render json: { message: '刷新 Git Token 失败' }, status: :bad_request
    end
  end
end

class InternalApi::UsersController < InternalApi::ApplicationController
  before_action :authenticate_user, except: [:models, :datasets, :codes, :spaces]

  # community @user and invite org member still use this
  def index
    users = User.where("name ~* ?", params[:name])
    render json: {users: users.as_json}
  end

  def jwt_token
    res = csghub_api.get_jwt_token(current_user.name, current_user.login_identity)
    token = JSON.parse(res)['data']['token']
    cookies['user_token'] = token
  end
end

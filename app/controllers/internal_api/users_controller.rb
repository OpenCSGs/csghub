class InternalApi::UsersController < ApplicationController
  before_action :authenticate_user

  def update
    current_user.name = user_params[:name]
    current_user.nickname = user_params[:nickname]
    current_user.email = user_params[:email]
    if user_params[:avatar].present?
      avatar_url_code = AliyunOss.instance.upload 'user-avatar', user_params[:avatar]
      current_user.avatar = avatar_url_code
    end
    if current_user.save
      render json: {message: '用户更新成功'}
    else
      render json: {message: '用户更新失败'}, status: 500
    end
  end

  private

  def user_params
    params.permit(:name, :nickname, :avatar, :email)
  end
end

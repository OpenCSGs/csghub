class Api::UsersController < Api::ApplicationController
  def update
    @current_user.name = user_params[:name]
    if user_params[:avatar].present?
      avatar_url_code = AliyunOss.instance.upload 'user-avatar', user_params[:avatar]
      @current_user.avatar = avatar_url_code
    end
    if @current_user.save
      render json: {message: '用户更新成功'}
    else
      render json: {message: '用户更新失败'}, status: 500
    end
  end

  private

  def user_params
    params.permit(:name, :avatar)
  end
end
class InternalApi::GitTokenController < ApplicationController
  def create
    begin
    res = Starhub.api.add_git_token(current_user.name, params[:name])
    puts JSON.parse(res)
    current_user.git_token = JSON.parse(res)["data"]["token"]
    if current_user.save
      render json: { message: '添加成功' }
    else
      render json: { message: '生成 Git Token 失败' }, status: :bad_request
    end
    rescue Starhub::Client::ApiError => e
      puts "Caught an internal server error: #{e.message}"
      return render json: { message: '生成 Git Token 失败' }, status: :bad_request
    end
  end

  private

  def create_params
    params.permit(:name)
  end
end



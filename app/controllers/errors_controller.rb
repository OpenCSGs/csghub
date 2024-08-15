class ErrorsController < ApplicationController
  skip_before_action :check_user_login

  def not_found
    render '404', status: 404
  end

  def unauthorized
    render 'unauthorized', status: 401
  end

  def login_failed
    @error_msg = params[:error_msg] || '未知登录错误，请联系管理员'
    render 'login_failed'
  end
end

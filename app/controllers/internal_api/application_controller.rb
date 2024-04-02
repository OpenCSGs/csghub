class InternalApi::ApplicationController < ApplicationController
  rescue_from StarhubError do |e|
    log_error e.message, e.backtrace
    render json: { message: (JSON.parse(e.message)["msg"] rescue e.message) }, status: 500
  end

  rescue_from SensitiveContentError do |e|
    log_error e.message, e.backtrace
    render json: {message: "监测到敏感内容！！！"}, status: 500
  end
end

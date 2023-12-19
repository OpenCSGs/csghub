class InternalApi::ApplicationController < ApplicationController
  rescue_from StarhubError do |e|
    log_error e.message
    render json: {message: "Git服务器报错"}, status: 500
  end
end

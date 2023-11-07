class Api::LeadsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    render json: {message: '创建成功!'}, status: 200
  end
end


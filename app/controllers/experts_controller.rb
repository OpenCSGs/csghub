class ExpertsController < ApplicationController
  def index
  end

  def form
  end

  def create
    puts "1231231231231"
    puts "Request parameters: #{request.params}"
    render json: {message: '创建成功!'}, status: 200
  end
end
class Api::ApplicationController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_current_user

  private

  def id_token
    pattern = /^Bearer /
    header  = request.headers['Authorization']
    header.gsub(pattern, '') if header && header.match(pattern)
  end

  def user_info
    JWT.decode(id_token, nil, false).first
  rescue JWT::DecodeError
    {}
  end

  def current_user
    User.find_by(login_identity: user_info['sub'])
  end

  def set_current_user
    if current_user
      @current_user = current_user
    else
      return render json: {message: "User not found"}, status: :not_found
    end
  end
end

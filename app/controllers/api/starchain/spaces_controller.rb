class Api::Starchain::SpacesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_current_user

  def create
    space = Space.new(space_params)
    space.user = @current_user
    if space.save
      render json: {message: "Space created"}
    else
      render json: {message: "Failed to create space"}, status: 500
    end
  end

  def update
  end

  def destroy
  end

  private 

  def space_params
    params.permit(:space_starchain_id, :title, :desc, :site_link, :space_type)
  end

  def id_token
    request.headers["Authorization"]
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

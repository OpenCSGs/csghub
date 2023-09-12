class Api::Starchain::SpacesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_current_user

  def create
    space = Space.new(create_params)
    space.user = @current_user
    if space.save
      render json: {message: "Space created"}
    else
      render json: {message: "Failed to create space"}, status: 400
    end
  end

  def update
    space = Space.find_by(space_starchain_id: params[:id])
    return render json: {message: "Space not found"} unless space

    if space.user.id != current_user.id
      render json: {message: "Unauthrorized"}, status: 401
    end

    if space.update(update_params)
      render json: {message: "Space updated"}
    else
      render json: {message: "Failed to update space"}, status: 400
    end
  end

  def destroy
    space = Space.find_by(space_starchain_id: params[:id])
    return render json: {message: "Space not found"} unless space

    if space.user.id != current_user.id
      render json: {message: "Unauthrorized"}, status: 401
    end

    if space.destroy
      render json: {message: "Space destroyed"}
    else
      render json: {message: "Failed to destroy space"}
    end
  end

  private 

  def create_params
    params.permit(:space_starchain_id, :title, :desc, :site_link, :space_type)
  end

  def update_params
    params.permit(:title, :desc, :site_link, :space_type)
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

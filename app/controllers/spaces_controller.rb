class SpacesController < ApplicationController
  before_action :authenticate_user, except: :index
  skip_before_action :verify_authenticity_token

  def index
    @spaces = policy_scope(Space).order(created_at: :desc).page params[:page]
  end

  def show
    @space = space
  end

  def update
    authorize space
    new_tags = []
    update_params[:tags].split(',').each do |tag_name|
      tag = Tag.find_by(name: tag_name)
      unless tag
        tag = Tag.create(name: tag_name, color: COLORS.sample)
      end
      new_tags << tag
    end
    space.tags = new_tags
    if update_params[:cover_image].present?
      image_url_code = AliyunOss.instance.upload 'space-cover', update_params[:cover_image]
      space.cover_image = image_url_code
    end
    space.space_type = update_params[:space_type]
    if space.save
      render json: {
        message: 'Space Saved',
        tags: space.tags.to_json,
        cover_image: space.cover_image_url,
        space_type: space.readable_type
      }
    else
      render json: {message: '更新失败!'}, status: 500
    end
  rescue Pundit::NotAuthorizedError
    render json: {message: '更新未授权!'}, status: 401
  end

  private

  def space
    @space ||= Space.find_by!(space_starchain_id: params[:id])
  end

  def update_params
    params.permit(:id, :tags, :cover_image, :space_type)
  end
end
class InternalApi::SpacesController < InternalApi::ApplicationController
  before_action :authenticate_user, only: :update

  def index
    @total_spaces = policy_scope(Space).order(created_at: :desc)
    @total_spaces = @total_spaces.where(user_id: current_user.id) if cookies[:mySpaces] == 'true'
    @spaces = @total_spaces.page(params[:page])
    render json: {spaces: @spaces.to_json, total_cards: @total_spaces.count}
  end

  def update
    space = Space.find_by!(space_starchain_id: params[:id])
    authorize space
    new_tags = []
    update_params[:tags].split(',').each do |tag_name|
      tag = Tag.find_or_create_by(name: tag_name) do |t|
        t.color = COLORS.sample
      end
      new_tags << tag
    end
    space.tags = new_tags
    if update_params[:cover_image].present?
      image_url_code = AwsS3.instance.upload 'space-cover', update_params[:cover_image]
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
  rescue ActiveRecord::RecordInvalid => e
    render json: {message: e.message}, status: 400
  end

  def create
    res = validate_owner
    if !res[:valid]
      return render json: { message: res[:message] }, status: :unprocessable_entity
    end
    model = current_user.created_models.build(create_params)
    if model.save
      render json: { path: model.path, message: '模型创建成功!' }, status: :created
    else
      render json: { message: model.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
    puts "success!!!!"
    render json: { message: "创建成功" }
  end

  private

  def update_params
    params.permit(:id, :tags, :cover_image, :space_type)
  end

  def create_params
    params.permit(:name, :nickname, :desc, :owner_id, :owner_type, :visibility, :license)
  end
end

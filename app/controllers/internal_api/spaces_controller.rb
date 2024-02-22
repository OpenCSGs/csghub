class InternalApi::SpacesController < InternalApi::ApplicationController
  before_action :authenticate_user

  def create
    res = validate_owner
    if !res[:valid]
      return render json: { message: res[:message] }, status: :unprocessable_entity
    end
    space = current_user.created_application_spaces.build(create_params)
    if params[:file].present?
      cover_image_code = AwsS3.instance.upload 'application-space-cover-image', params[:file]
      space.cover_image = cover_image_code
    end
    if space.save
      render json: { path: space.path, message: '应用空间创建成功!' }, status: :created
    else
      render json: { message: space.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  private

  def create_params
    params.permit(:name, :nickname, :desc, :sdk, :cloud_resource, :owner_id, :owner_type, :visibility, :license)
  end

  def validate_owner
    if params[:owner_type] == 'User' && current_user.id.to_i != params[:owner_id].to_i
      return { valid: false, message: '用户不存在' }
    elsif params[:owner_type] == 'Organization'
      org = current_user.organizations.find_by(id: params[:owner_id])
      if !org || current_user.org_role(org) == 'read'
        return { valid: false, message: '组织不存在或无权限' }
      end
    end
    { valid: true }
  end
end

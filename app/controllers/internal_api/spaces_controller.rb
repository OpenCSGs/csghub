class InternalApi::ApplicationSpacesController < InternalApi::ApplicationController
  before_action :authenticate_user

  include Api::SyncStarhubHelper
  include Api::BuildCommitHelper
  include Api::FileOptionsHelper
  include Api::RepoValidation

  def create
    application_space = current_user.created_application_spaces.build(create_params)
    if params[:file].present?
      cover_image_code = AwsS3.instance.upload 'application-space-cover-image', params[:file]
      cover_image_url = AwsS3.instance.download cover_image_code
      application_space.cover_image = cover_image_url
    end
    if application_space.save
      render json: { path: application_space.path, message: I18n.t('application_space.space_created') }, status: :created
    else
      render json: { message: application_space.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  private

  def create_params
    params.permit(:name, :nickname, :desc, :sdk, :cloud_resource, :owner_id, :owner_type, :visibility, :license)
  end
end

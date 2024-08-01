class InternalApi::ApplicationSpacesController < InternalApi::ApplicationController
  before_action :authenticate_user, except: [:files, :readme]

  include Api::SyncStarhubHelper
  include Api::BuildCommitHelper
  include Api::FileOptionsHelper
  include Api::RepoValidation

  def create
    application_space = current_user.created_application_spaces.build(create_params)
    if application_space.save
      render json: { path: application_space.path, message: I18n.t('application_space.space_created') }, status: :created
    else
      render json: { message: application_space.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update
    if params[:private].to_s.present?
      @application_space.visibility = params[:private].to_s == 'true' ? 'private' : 'public'
    end

    @application_space.nickname = params[:nickname] if params[:nickname].present?
    @application_space.desc = params[:desc] if params[:desc].present?
    @application_space.cloud_resource = params[:cloud_resource] if params[:cloud_resource].present?
    @application_space.cover_image = params[:cover_image] if params[:cover_image].present?

    if @application_space.save
      render json: { message: I18n.t('repo.updateSuccess') }
    else
      render json: { message: I18n.t('repo.updateFailed') }, status: :bad_request
    end
  end

  def destroy
    if @application_space.destroy
      render json: { message: I18n.t('repo.delSuccess') }
    else
      render json: { message: I18n.t('repo.delFailed') }, status: :bad_request
    end
  end

  private

  def create_params
    params.permit(:name, :nickname, :desc, :sdk, :cloud_resource, :owner_id, :owner_type, :visibility, :license, :cover_image)
  end
end

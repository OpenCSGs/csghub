class InternalApi::CodesController < InternalApi::ApplicationController
  before_action :authenticate_user, except: [:files, :readme]

  include Api::SyncStarhubHelper
  include Api::BuildCommitHelper
  include Api::FileOptionsHelper
  include Api::RepoValidation

  def create
    code = current_user.created_codes.build(code_params)
    if code.save
      render json: { path: code.path, message: I18n.t('repo.createSuccess') }, status: :created
    else
      render json: { message: code.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update
    if params[:private].to_s.present?
      @code.visibility = params[:private].to_s == 'true' ? 'private' : 'public'
    end

    @code.nickname = params[:nickname] if params[:nickname].present?
    @code.desc = params[:desc] if params[:desc].present?

    if @code.save
      render json: { message: I18n.t('repo.updateSuccess') }
    else
      render json: { message: I18n.t('repo.updateFailed') }, status: :bad_request
    end
  end

  def destroy
    if @code.destroy
      render json: { message: I18n.t('repo.delSuccess') }
    else
      render json: { message: I18n.t('repo.delFailed') }, status: :bad_request
    end
  end

  private

  def code_params
    params.permit(:name, :nickname, :desc, :owner_id, :owner_type, :visibility, :license)
  end
end

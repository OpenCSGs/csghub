class InternalApi::DatasetsController < InternalApi::ApplicationController
  before_action :authenticate_user, except: [:files, :readme]

  include Api::SyncStarhubHelper
  include Api::BuildCommitHelper
  include Api::FileOptionsHelper
  include Api::RepoValidation

  def create
    dataset = current_user.created_datasets.build(dataset_params)
    if dataset.save
      render json: { path: dataset.path, message: I18n.t('repo.createSuccess') }, status: :created
    else
      render json: { message: dataset.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update
    @dataset.nickname = params[:nickname] if params[:nickname].present?
    @dataset.desc = params[:desc] if params[:desc].present?

    if @dataset.save
      render json: { message: I18n.t('repo.updateSuccess') }
    else
      render json: { message: I18n.t('repo.updateFailed') }, status: :bad_request
    end
  end

  def destroy
    if @dataset.destroy
      render json: { message: I18n.t('repo.delSuccess') }
    else
      render json: { message: I18n.t('repo.delFailed') }, status: :bad_request
    end
  end

  private

  def dataset_params
    params.permit(:name, :nickname, :desc, :owner_id, :owner_type, :license)
  end
end

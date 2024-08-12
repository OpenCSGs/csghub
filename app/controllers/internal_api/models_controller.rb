class InternalApi::ModelsController < InternalApi::ApplicationController
  # Todo: remove later
  # before_action :authenticate_user, except: [:files, :readme, :predict]

  # include Api::SyncStarhubHelper
  # include Api::BuildCommitHelper
  # include Api::FileOptionsHelper
  # include Api::RepoValidation

  # def create
  #   model = current_user.created_models.build(model_params)
  #   if model.save
  #     render json: { path: model.path, message: I18n.t('repo.createSuccess') }, status: :created
  #   else
  #     render json: { message: model.errors.full_messages.to_sentence }, status: :unprocessable_entity
  #   end
  # end

  # def update
  #   if params[:private].to_s.present?
  #     @model.visibility = params[:private].to_s == 'true' ? 'private' : 'public'
  #   end

  #   @model.nickname = params[:nickname] if params[:nickname].present?
  #   @model.desc = params[:desc] if params[:desc].present?

  #   if @model.save
  #     render json: { message: I18n.t('repo.updateSuccess') }
  #   else
  #     render json: { message: I18n.t('repo.updateFailed') }, status: :bad_request
  #   end
  # end

  # def destroy
  #   if @model.destroy
  #     render json: { message: I18n.t('repo.delSuccess') }
  #   else
  #     render json: { message: I18n.t('repo.delFailed') }, status: :bad_request
  #   end
  # end

  # def predict
  #   res = csghub_api.model_predict(params[:namespace], params[:model_name], current_user&.name, params[:input], params[:current_branch])
  #   render json: { message: I18n.t('models.predict_success'), result: JSON.parse(res)['data']['content'] }
  # end

  # private

  # def model_params
  #   params.permit(:name, :nickname, :desc, :owner_id, :owner_type, :visibility, :license)
  # end
end

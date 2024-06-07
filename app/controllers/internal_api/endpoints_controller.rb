class InternalApi::EndpointsController < InternalApi::ApplicationController
  before_action :authenticate_user
  before_action :valid_model_path, only: [:create]

  include Api::RepoValidation

  def create
    endpoint = current_user.created_endpoints.build(endpoint_params)
    if endpoint.save
      render json: { endpoint_id: endpoint.endpoint_id, message: I18n.t('repo.createSuccess') }, status: :created
    else
      render json: { message: endpoint.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update
    if params[:private].to_s.present?
      @endpoint.visibility = params[:private].to_s == 'true' ? 'private' : 'public'
    end

    @endpoint.cloud_resource = params[:cloud_resource] if params[:cloud_resource].present?
    @endpoint.min_replica = params[:min_replica] if params[:min_replica].present?
    @endpoint.max_replica = params[:max_replica] if params[:max_replica].present?
    @endpoint.framework_id = params[:framework_id] if params[:framework_id].present?

    if @endpoint.save
      render json: { message: I18n.t('repo.updateSuccess') }
    else
      render json: { message: I18n.t('repo.updateFailed') }, status: :bad_request
    end
  end

  def destroy
    if @endpoint.destroy
      render json: { message: I18n.t('repo.delSuccess') }
    else
      render json: { message: I18n.t('repo.delFailed') }, status: :bad_request
    end
  end

  private

  def endpoint_params
    params.permit(:name, :model_path, :min_replica, :max_replica, :cloud_resource, :framework_id, :cluster_id, :visibility).merge(owner: current_user)
  end

  def valid_model_path
    owner = User.find_by(name: params[:model_path].split('/').first) || Organization.find_by(name: params[:model_path].split('/').first)
    return render json: { message: "Owner not found" }, status: :not_found unless owner

    model = Model.find_by(name: params[:model_path].split('/').last, owner: owner)
    return render json: { message: "Model not found" }, status: :not_found unless model

    return render json: { message: "Unauthorized" }, status: :unauthorized unless model.model_public? || current_user.can_read?(model)
  end
end

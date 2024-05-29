class InternalApi::EndpointsController < InternalApi::ApplicationController
  before_action :authenticate_user

  include Api::RepoValidation

  def create
    endpoint = current_user.created_endpoints.build(endpoint_params)
    if endpoint.save
      render json: { message: I18n.t('repo.createSuccess') }, status: :created
    else
      render json: { message: endpoint.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  private

  def endpoint_params
    params.permit(:name, :model_path, :min_replica, :max_replica, :cloud_resource, :framework_id, :cluster_id, :visibility).merge(owner: current_user)
  end
end

class InternalApi::Admin::SyncSettingsController < InternalApi::Admin::ApplicationController
  def index
    render json: csghub_api.get_sync_settings(current_user.name)
  end

  def create
    res = csghub_api.create_sync_settings(current_user.name, sync_setting_params)
    raise StarhubError, res.body unless res.success?
    render json: { message: 'Sync Setting created successfully' }
  rescue => e
    render json: {message: "Sync Setting created failed, #{e.message}"}, status: 400
  end

  def sync_repos
    render json: csghub_api.get_sync_repos(current_user.name)
  end

  private

  def sync_setting_params
    params.permit(:token, :concurrent_count, :max_bandwidth)
  end
end
class InternalApi::Admin::SyncSettingsController < InternalApi::Admin::ApplicationController
  DEFAULT_SYNC_TOKEN = '8d1cbcd3cdd843ec800171a0f51961e6'.freeze

  def index
    response = csghub_api.get_sync_settings(current_user.name)
    data = JSON.parse(response)['data']
    data['is_default'] = (data['token'] == DEFAULT_SYNC_TOKEN)

    render json: { data: data }
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
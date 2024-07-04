class InternalApi::Admin::SystemConfigController < InternalApi::Admin::ApplicationController
  def index
    @system_config = SystemConfig.first
    render json: { system_configs: @system_config }
  end
end

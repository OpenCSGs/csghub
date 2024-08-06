class InternalApi::Admin::SystemConfigController < InternalApi::Admin::ApplicationController
  def index
    @system_config = SystemConfig.first
    render json: { system_configs: @system_config }
  end

  def update
    @system_config = SystemConfig.first
    if @system_config.update(system_config_params)
      render json: {msg: '配置已更新'}
    else
      render json: {msg: '配置更新失败'}, status: 400
    end
  end

  def license
    license_info_list = SystemConfig.first[:license_info]
    render json: {license_info: license_info_list}
  end

  private

  def system_config_params
    params.require(:system_config).permit(feature_flags: {},
                                          s3_configs: {})
    params.require(:system_config).permit!.to_h
  end
end

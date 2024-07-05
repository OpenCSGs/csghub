class InternalApi::Admin::SystemConfigController < InternalApi::Admin::ApplicationController
  def index
    @system_config = SystemConfig.first
    render json: { system_configs: @system_config }
  end

  def update
    @system_config = SystemConfig.first
    # 这里必须使用 permit!，因为传递过来的参数结构包含两个同样的 key，
    # params.permit(:feature_flags) 还不能工作，待研究
    system_config_params = params.permit!.slice(:feature_flags,
                                                :general_configs,
                                                :s3_configs)
    if @system_config.update(system_config_params)
      render json: {msg: '配置已更新'}
    else
      render json: {msg: '配置更新失败'}, status: 400
    end
  end
end

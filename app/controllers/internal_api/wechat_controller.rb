class InternalApi::WechatController < InternalApi::ApplicationController
  def signature_config
    sign_noncestr = SecureRandom.alphanumeric(16)
    sign_timestamp = Time.now.to_i
    signature = Wechat.instance.signature(params[:page_url], sign_noncestr, sign_timestamp)
    render json: { noncestr: sign_noncestr,
                   timestamp: sign_timestamp,
                   signature: signature,
                   app_id: ENV.fetch('WECHAT_APP_ID') }
  end
end

require 'digest'

class Wechat
  include Singleton

  def signature(page_url, sign_noncestr, sign_timestamp)
    jsapi_ticket_string = "jsapi_ticket=#{jsapi_ticket}&noncestr=#{sign_noncestr}&timestamp=#{sign_timestamp}&url=#{page_url}"
    Digest::SHA1.hexdigest(jsapi_ticket_string)
  end

  private

  def jsapi_ticket
    Rails.cache.fetch('wechat_jsapi_ticket', expires_in: 7200.seconds) do
      response = Faraday.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=#{access_token}&type=jsapi")
      JSON.parse(response.body)['ticket']
    end
  end

  def access_token
    Rails.cache.fetch('wechat_access_token', expires_in: 7200.seconds) do
      response = Faraday.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=#{app_id}&secret=#{app_key}")
      body = JSON.parse(response.body)
      if body['access_token']
        return body['access_token']
      else
        raise WechatError, body['errmsg']
      end
    end
  end

  def app_id
    ENV.fetch('WECHAT_APP_ID', '')
  end

  def app_key
    ENV.fetch('WECHAT_APP_KEY', '')
  end
end

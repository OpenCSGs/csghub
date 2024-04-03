Aliyun::CloudSms.configure do |config|
  config.access_key_secret = ENV['ALIYUN_SMS_SECRET']
  config.access_key_id = ENV['ALIYUN_SMS_ID']
  config.sign_name = ENV['ALIYUN_SMS_SIGNNAME']
end

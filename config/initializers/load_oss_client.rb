ActiveSupport::Reloader.to_prepare do
  oss_type = Rails.application.credentials.oss_type.send(Rails.env)

  $oss_client = if oss_type == 'aliyun'
                  AliyunOss.instance
                else
                  AwsS3.instance
                end
end

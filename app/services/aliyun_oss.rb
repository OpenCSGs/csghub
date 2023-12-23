require 'aliyun/oss'

class AliyunOss
  include Singleton

  # for partner portal the bucket name is: partner-portal
  # there are two sub-directory under it: 'partner-logo' and 'contract'
  def initialize
    @oss_client = Aliyun::OSS::Client.new(endpoint: endpoint,
                                          access_key_id: access_id,
                                          access_key_secret: access_secret)
  end

  # for aliyun oss API the file should be a local file path
  def upload type, file
    return '' unless file.present?

    object_key = case type
                 when 'user-avatar'
                   "avatar/#{random_file_name}"
                 when 'org-logo'
                   "org_logo/#{random_file_name}"
                 when 'space-cover'
                   "space/#{random_file_name}"
                 when 'comment'
                   "comment/#{random_file_name}"
                 else
                   random_file_name
                 end
    if bucket.put_object(object_key, file: file.path)
      object_key
    else
      ''
    end
  end

  def download object_key
    # 6000s 过期
    bucket.object_url(object_key, true, 6000)
  rescue Aliyun::OSS::ServerError
    ""
  end

  def download_public object_key
    # 10年过期时间
    bucket.object_url(object_key, true, 315360000)
  rescue Aliyun::OSS::ServerError
    ""
  end

  private

  def bucket
    @oss_client.get_bucket(bucket_name)
  end

  def bucket_name
    if Rails.env.production?
      Rails.application.credentials.aliyun_oss.production.bucket_name
    else
      Rails.application.credentials.aliyun_oss.staging.bucket_name
    end
  end

  def endpoint
    if Rails.env.production?
      Rails.application.credentials.aliyun_oss.production.endpoint
    else
      Rails.application.credentials.aliyun_oss.staging.endpoint
    end
  end

  def access_id
    if Rails.env.production?
      Rails.application.credentials.aliyun_oss.production.access_id
    else
      Rails.application.credentials.aliyun_oss.staging.access_id
    end
  end

  def access_secret
    if Rails.env.production?
      Rails.application.credentials.aliyun_oss.production.access_secret
    else
      Rails.application.credentials.aliyun_oss.staging.access_secret
    end
  end

  def random_file_name
    SecureRandom.base58(8)
  end
end

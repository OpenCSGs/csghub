class AwsS3
  include Singleton

  def initialize
    @s3 = Aws::S3::Resource::new(
      credentials: Aws::Credentials.new(access_id, access_secret),
      endpoint: endpoint,
      region: 'beijing'
    )
  end

  def upload type, file
    return '' unless file.present?

    object_key = case type
                 when 'user-avatar'
                   "avatar/#{random_file_name}"
                 when 'org-logo'
                   "org_logo/#{random_file_name}"
                 when 'comment'
                   "comment/#{random_file_name}"
                 else
                   random_file_name
                 end
    if bucket.object(object_key).upload_file(file.path, { content_type: file.content_type, acl: 'public-read' })
      object_key
    else
      ''
    end
  end

  def download object_key
    bucket.object(object_key).public_url
  rescue Aliyun::OSS::ServerError
    ""
  end

  private

  def bucket
    @s3.bucket(bucket_name)
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

class AwsS3
  include Singleton

  def initialize
    @s3 = Aws::S3::Resource::new(
      credentials: Aws::Credentials.new(access_id, access_secret),
      endpoint: endpoint,
      region: region,
      force_path_style: force_path_style
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
                 when 'application-space-cover-image'
                   "space/#{random_file_name}"
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

  def bucket_name
    load_s3_config 'bucket_name'
  end

  private

  def bucket
    @s3.bucket(bucket_name)
  end

  def endpoint
    load_s3_config 'endpoint'
  end

  def access_id
    load_s3_config 'access_id'
  end

  def access_secret
    load_s3_config 'access_secret'
  end

  def region
    load_s3_config 'region'
  end

  def force_path_style
    load_s3_config('force_path_style') == 'true'
  end

  def load_s3_config key
    env_config = ENV.fetch(key.upcase, nil)
    default_config = Rails.application.credentials.s3.send(Rails.env)&.send(key)
    env_config || default_config
  end

  def random_file_name
    SecureRandom.uuid
  end
end

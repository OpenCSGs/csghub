class InternalApi::UploadController < InternalApi::ApplicationController
  def create
    bucket_code = AliyunOss.instance.upload 'comment', upload_params[:file]
    Starhub.api.image_secure_check('baselineCheck', bucket_name, bucket_code) if bucket_code.present?
    public_url = AliyunOss.instance.download bucket_code
    if public_url.blank?
      render json: {message: '上传文件失败'}, status: 400
    else
      render json: {url: public_url}
    end
  end

  private

  def upload_params
    params.permit(:file)
  end

  def bucket_name
    if Rails.env.production?
      Rails.application.credentials.aliyun_oss.production.bucket_name
    else
      Rails.application.credentials.aliyun_oss.staging.bucket_name
    end
  end
end

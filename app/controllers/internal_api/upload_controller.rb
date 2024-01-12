class InternalApi::UploadController < InternalApi::ApplicationController
  def create
    bucket_code = AwsS3.instance.upload 'comment', upload_params[:file]
    Starhub.api.image_secure_check('baselineCheck', bucket_name, bucket_code) if bucket_code.present?
    public_url = AwsS3.instance.download bucket_code
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
    AwsS3.instance.bucket_name
  end
end

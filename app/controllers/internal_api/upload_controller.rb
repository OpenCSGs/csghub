class InternalApi::UploadController < InternalApi::ApplicationController
  before_action :authenticate_user
  before_action :check_file_size, only: [:create]

  def create
    bucket_code = AwsS3.instance.upload 'comment', upload_params[:file]
    csghub_api.image_secure_check('baselineCheck', bucket_name, bucket_code) if bucket_code.present?
    public_url = AwsS3.instance.download bucket_code
    if public_url.blank?
      render json: {message: '上传文件失败'}, status: 400
    else
      render json: {url: public_url, code: bucket_code}
    end
  end

  private

  def upload_params
    params.permit(:file)
  end

  def bucket_name
    AwsS3.instance.bucket_name
  end

  def check_file_size
    return if params[:file_max_size].blank?

    if params[:file].size > params[:file_max_size].to_f
      return render json: {message: "文件大小不能超过 #{(params[:file_max_size].to_f / 1024 / 1024).round(2)} MB"}, status: 400
    end
  end
end

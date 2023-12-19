class InternalApi::UploadController < InternalApi::ApplicationController
  def create
    bucket_code = AliyunOss.instance.upload 'comment', upload_params[:file]
    public_url = AliyunOss.instance.download_public bucket_code
    if public_url.blank?
      render json: {message: '上传文件失败'}, status: 400
    else
      render json: {url: public_url}
    end
  rescue => e
    render json: {message: '上传文件失败'}, status: 400
  end

  private

  def upload_params
    params.permit(:file)
  end
end

class InternalApi::ModelsController < InternalApi::ApplicationController
  before_action :authenticate_user, except: [:index, :files, :readme]

  include Api::SyncStarhubHelper
  include Api::BuildCommitHelper
  include Api::FileOptionsHelper
  include Api::RepoValidation

  def index
    res_body = Starhub.api.get_models(current_user&.name,
                                      params[:search],
                                      params[:sort],
                                      params[:task_tag],
                                      params[:framework_tag],
                                      params[:license_tag],
                                      params[:page],
                                      params[:per_page])
    api_response = JSON.parse(res_body)
    render json: { models: api_response['data'], total: api_response['total'] }
  end

  def files
    last_commit, files = Starhub.api.get_model_detail_files_data_in_parallel(params[:namespace], params[:model_name], files_options)
    render json: { last_commit: JSON.parse(last_commit)['data'], files: JSON.parse(files)['data'] }
  end

  def readme
    readme = Starhub.api.get_model_file_content(params[:namespace], params[:model_name], 'README.md')
    render json: { readme: JSON.parse(readme)['data'] }
  rescue StarhubError
    render json: { readme: '' }
  end

  def create
    model = current_user.created_models.build(model_params)
    if model.save
      render json: { path: model.path, message: '模型创建成功!' }, status: :created
    else
      render json: { message: model.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update
    if params[:private].to_s == 'true'
      @model.visibility = 'private'
    else
      @model.visibility = 'public'
    end

    @model.nickname = params[:nickname] if params[:nickname].present?
    @model.desc = params[:desc] if params[:desc].present?

    if @model.save
      render json: { message: '更新成功' }
    else
      render json: { message: "更新失败" }, status: :bad_request
    end
  end

  def destroy
    if @model.destroy
      render json: { message: '删除成功' }
    else
      render json: { message: "删除 #{params[:namespace]}/#{params[:model_name]} 失败" }, status: :bad_request
    end
  end

  def create_file
    options = file_params.slice(:branch).merge({
                                                 message: build_create_commit_message,
                                                 new_branch: 'main',
                                                 username: current_user.name,
                                                 email: current_user.email,
                                                 content: Base64.encode64(params[:content])
                                               })
    sync_create_file('model', options)
    render json: { message: '创建文件成功' }
  end

  def upload_file
    file = params[:file]
    options = {
      branch: 'main',
      file_path: file.original_filename,
      file: Multipart::Post::UploadIO.new(file.tempfile.path, file.content_type),
      email: current_user.email,
      message: build_upload_commit_message,
      username: current_user.name
    }
    sync_upload_file('model', options)
    render json: { message: '上传文件成功' }, status: 200
  end

  private

  def model_params
    params.permit(:name, :nickname, :desc, :owner_id, :owner_type, :visibility, :license)
  end

  def file_params
    params.permit(:path, :content, :branch, :commit_title, :commit_desc)
  end
end

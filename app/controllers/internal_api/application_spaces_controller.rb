class InternalApi::ApplicationSpacesController < InternalApi::ApplicationController
  before_action :authenticate_user, except: [:index, :files, :readme]

  include Api::SyncStarhubHelper
  include Api::BuildCommitHelper
  include Api::FileOptionsHelper
  include Api::RepoValidation

  def index
    res_body = Starhub.api.get_application_spaces(current_user&.name,
                                        params[:search],
                                        params[:sort],
                                        params[:task_tag],
                                        params[:framework_tag],
                                        params[:license_tag],
                                        params[:page],
                                        params[:per_page])
    api_response = JSON.parse(res_body)
    render json: { application_spaces: api_response['data'], total: api_response['total'] }
  end

  def files
    last_commit, files = Starhub.api.get_application_space_detail_files_data_in_parallel(params[:namespace], params[:application_space_name], files_options)
    render json: { last_commit: JSON.parse(last_commit)['data'], files: JSON.parse(files)['data'] }
  end

  def readme
    readme = Starhub.api.get_application_space_file_content(params[:namespace], params[:application_space_name], 'README.md')
    readme_content = JSON.parse(readme)['data']
    readme_content = relative_path_to_resolve_path 'application_space', readme_content
    render json: { readme: readme_content }
  rescue StarhubError
    render json: { readme: '' }
  end

  def create
    application_space = current_user.created_application_spaces.build(create_params)
    if application_space.save
      render json: { path: application_space.path, message: I18n.t('application_space.space_created') }, status: :created
    else
      render json: { message: application_space.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def create_file
    options = create_file_params.slice(:branch).merge({ message: build_create_commit_message,
                                                        new_branch: 'main',
                                                        username: current_user.name,
                                                        email: current_user.email,
                                                        content: Base64.encode64(params[:content])
                                                      })
    sync_create_file('application_space', options)
    render json: { message: '创建文件成功' }
  end


  def update_file
    options = update_file_params.slice(:branch, :sha).merge({ message: build_update_commit_message,
                                                        new_branch: 'main',
                                                        username: current_user.name,
                                                        email: current_user.email,
                                                        content: Base64.encode64(params[:content])
                                                      })
    sync_update_file('application_space', options)
    render json: { message: '更新文件成功' }
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
    sync_upload_file('application_space', options)
    render json: { message: '上传文件成功' }, status: 200
  end

  private

  def create_params
    params.permit(:name, :nickname, :desc, :sdk, :cloud_resource, :owner_id, :owner_type, :visibility, :license, :cover_image)
  end

  def create_file_params
    params.permit(:path, :content, :branch, :commit_title, :commit_desc)
  end

  def update_file_params
    params.permit(:path, :content, :branch, :commit_title, :commit_desc, :sha)
  end
end

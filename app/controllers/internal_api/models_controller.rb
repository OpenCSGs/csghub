class InternalApi::ModelsController < InternalApi::ApplicationController
  before_action :authenticate_user, except: [:index, :files, :readme, :predict, :related_repos]

  include Api::SyncStarhubHelper
  include Api::BuildCommitHelper
  include Api::FileOptionsHelper
  include Api::RepoValidation

  def index
    res_body = csghub_api.get_models(current_user&.name,
                                     params[:search],
                                     params[:sort],
                                     params[:task_tag],
                                     params[:framework_tag],
                                     params[:language_tag],
                                     params[:license_tag],
                                     params[:page],
                                     params[:per_page])
    api_response = JSON.parse(res_body)
    render json: { models: api_response['data'], total: api_response['total'] }
  end

  def related_repos
    res_body = csghub_api.model_related_repos(params[:namespace], params[:model_name], files_options)
    api_response = JSON.parse(res_body)
    render json: { relations: api_response['data']}
  end

  def files
    last_commit, files = csghub_api.get_model_detail_files_data_in_parallel(params[:namespace], params[:model_name], files_options)
    last_commit_user = User.find_by(name: JSON.parse(last_commit)["data"]["committer_name"])
    render json: { last_commit: JSON.parse(last_commit)['data'], files: JSON.parse(files)['data'], last_commit_user: last_commit_user }
  end

  def readme
    readme = csghub_api.get_model_file_content(params[:namespace], params[:model_name], 'README.md', {current_user: current_user&.name})
    readme_content = JSON.parse(readme)['data']
    readme_content = relative_path_to_resolve_path 'model', readme_content
    render json: { readme: readme_content }
  rescue StarhubError
    render json: { readme: '' }
  end

  def create
    model = current_user.created_models.build(model_params)
    if model.save
      render json: { path: model.path, message: I18n.t('repo.createSuccess') }, status: :created
    else
      render json: { message: model.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update
    if params[:private].to_s.present?
      @model.visibility = params[:private].to_s == 'true' ? 'private' : 'public'
    end

    @model.nickname = params[:nickname] if params[:nickname].present?
    @model.desc = params[:desc] if params[:desc].present?

    if @model.save
      render json: { message: I18n.t('repo.updateSuccess') }
    else
      render json: { message: I18n.t('repo.updateFailed') }, status: :bad_request
    end
  end

  def destroy
    if @model.destroy
      render json: { message: I18n.t('repo.delSuccess') }
    else
      render json: { message: I18n.t('repo.delFailed') }, status: :bad_request
    end
  end

  def create_file
    options = create_file_params.slice(:branch).merge({ message: build_create_commit_message,
                                                        new_branch: 'main',
                                                        username: current_user.name,
                                                        email: current_user.email,
                                                        content: Base64.encode64(params[:content])
                                                      })
    sync_create_file('model', options)
    render json: { message: I18n.t('repo.createFileSuccess') }
  end

  def update_readme_tags
    tags = params[:tags]

    # # 更新 README 元数据中的 tags
    blob =  csghub_api.get_model_blob(params[:namespace], params[:model_name], 'README.md', {current_user: current_user&.name})
    content =JSON.parse(blob).dig("data", "content")
    metadata_data = Base64.decode64(content).force_encoding('UTF-8')
    metadata_hash = YAML.safe_load(metadata_data)
    sha = JSON.parse(blob).dig("data", "sha")
    # 查找元数据部分的结束位置
    end_index = metadata_data.index('---', 3)

    # 提取数据部分
    readme_content = metadata_data[end_index+4 .. -1] || ""

    # 更新或添加 tags
    metadata_hash['tags'] = tags
    # 重新生成元数据部分
    updated_metadata_part = YAML.dump(metadata_hash)
    updated_metadata_part += "---\n"  # 手动添加`---`标记

    # 更新 README 内容
    updated_readme_content = updated_metadata_part + readme_content
    options = update_file_params.slice(:branch).merge({ message: build_update_commit_message,
                                                        new_branch: 'main',
                                                        username: current_user.name,
                                                        email: current_user.email,
                                                        content: Base64.encode64(updated_readme_content),
                                                        sha:sha
                                                      })
    sync_update_file('model', options)
    render json: { message: I18n.t('tags.update.success') }
  rescue StandardError => e
    log_error e.message, e.backtrace
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def upload_file
    sync_upload_file('model', upload_options)
    render json: { message: I18n.t('repo.uploadFileSuccess') }, status: 200
  end

  def predict
    res = csghub_api.model_predict(params[:namespace], params[:model_name], current_user&.name, params[:input], params[:current_branch])
    render json: { message: I18n.t('models.predict_success'), result: JSON.parse(res)['data']['content'] }
  end

  private

  def model_params
    params.permit(:name, :nickname, :desc, :owner_id, :owner_type, :visibility, :license)
  end

  def create_file_params
    params.permit(:path, :content, :branch, :commit_title, :commit_desc)
  end

  def update_file_params
    params.permit(:path, :content, :branch, :commit_title, :commit_desc, :sha)
  end
end

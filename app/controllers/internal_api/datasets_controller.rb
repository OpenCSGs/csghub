class InternalApi::DatasetsController < InternalApi::ApplicationController
  before_action :authenticate_user, except: [:index, :files, :readme, :preview_parquet, :related_repos]

  include Api::SyncStarhubHelper
  include Api::BuildCommitHelper
  include Api::FileOptionsHelper
  include Api::RepoValidation

  def index
    res_body = csghub_api.get_datasets(current_user&.name,
                                       params[:search],
                                       params[:sort],
                                       params[:task_tag],
                                       params[:framework_tag],
                                       params[:language_tag],
                                       params[:license_tag],
                                       params[:page],
                                       params[:per_page])
    api_response = JSON.parse(res_body)
    render json: { datasets: api_response['data'], total: api_response['total'] }
  end

  def related_repos
    res_body = csghub_api.dataset_related_repos(params[:namespace], params[:dataset_name], files_options)
    api_response = JSON.parse(res_body)
    render json: { relations: api_response['data']}
  end

  def files
    last_commit, files = csghub_api.get_dataset_detail_files_data_in_parallel(params[:namespace], params[:dataset_name], files_options)
    last_commit_user = User.find_by(name: JSON.parse(last_commit)["data"]["committer_name"])
    render json: { last_commit: JSON.parse(last_commit)['data'], files: JSON.parse(files)['data'], last_commit_user: last_commit_user }
  end

  def readme
    readme = csghub_api.get_dataset_file_content(params[:namespace], params[:dataset_name], 'README.md', {current_user: current_user&.name})
    readme_content = JSON.parse(readme)['data']
    readme_content = relative_path_to_resolve_path 'dataset', readme_content
    render json: { readme: readme_content }
  rescue StarhubError
    render json: { readme: '' }
  end

  def create
    dataset = current_user.created_datasets.build(dataset_params)
    if dataset.save
      render json: { path: dataset.path, message: I18n.t('repo.createSuccess') }, status: :created
    else
      render json: { message: dataset.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update
    @dataset.nickname = params[:nickname] if params[:nickname].present?
    @dataset.desc = params[:desc] if params[:desc].present?

    if @dataset.save
      render json: { message: I18n.t('repo.updateSuccess') }
    else
      render json: { message: I18n.t('repo.updateFailed') }, status: :bad_request
    end
  end

  def destroy
    if @dataset.destroy
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
    sync_create_file('dataset', options)
    render json: { message: I18n.t('repo.createFileSuccess') }
  end

  def update_readme_tags
    tags = params[:tags]

    # 更新 README 元数据中的 tags
    blob =  csghub_api.get_dataset_blob(params[:namespace], params[:dataset_name], 'README.md', {current_user: current_user&.name})
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
    sync_update_file('dataset', options)
    render json: { message: I18n.t('tags.update.success') }
  rescue StandardError => e
    log_error e.message, e.backtrace
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def upload_file
    sync_upload_file('dataset', upload_options)
    render json: { message: I18n.t('repo.uploadFileSuccess') }
  end

  def preview_parquet
    json_data = csghub_api.get_dataset_files(params[:namespace], params[:dataset_name], { path: params[:path], current_user: current_user&.name })
    parquet_file_path = JSON.parse(json_data)['data']
                            .filter_map { |file| file['path'].end_with?('.parquet') ? file['path'] : nil }
                            .sort_by { |path| path.downcase }.first
    if parquet_file_path
      preview_data = csghub_api.preview_datasets_parquet_file(params[:namespace], params[:dataset_name], parquet_file_path, {current_user: current_user&.name})
      render json: preview_data
    else
      render json: {}
    end
  end

  private

  def dataset_params
    params.permit(:name, :nickname, :desc, :owner_id, :owner_type, :license)
  end

  def create_file_params
    params.permit(:path, :content, :branch, :commit_title, :commit_desc)
  end

  def update_file_params
    params.permit(:path, :content, :branch, :commit_title, :commit_desc, :sha)
  end
end

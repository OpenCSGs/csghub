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
end

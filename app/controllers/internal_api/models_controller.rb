class InternalApi::ModelsController < InternalApi::ApplicationController
  before_action :authenticate_user, except: [:files, :readme, :predict, :related_repos]

  include Api::SyncStarhubHelper
  include Api::BuildCommitHelper
  include Api::FileOptionsHelper
  include Api::RepoValidation

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

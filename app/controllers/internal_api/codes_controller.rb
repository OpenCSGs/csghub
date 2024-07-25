class InternalApi::CodesController < InternalApi::ApplicationController
  before_action :authenticate_user, except: [:files, :readme, :related_repos]

  include Api::SyncStarhubHelper
  include Api::BuildCommitHelper
  include Api::FileOptionsHelper
  include Api::RepoValidation

  def related_repos
    res_body = csghub_api.code_related_repos(params[:namespace], params[:code_name], files_options)
    api_response = JSON.parse(res_body)
    render json: { relations: api_response['data']}
  end

  def files
    last_commit, files = csghub_api.get_code_detail_files_data_in_parallel(params[:namespace], params[:code_name], files_options)
    last_commit_user = User.find_by(name: JSON.parse(last_commit)["data"]["committer_name"])
    render json: { last_commit: JSON.parse(last_commit)['data'], files: JSON.parse(files)['data'], last_commit_user: last_commit_user }
  end

  def readme
    readme = csghub_api.get_code_file_content(params[:namespace], params[:code_name], 'README.md', {current_user: current_user&.name})
    readme_content = JSON.parse(readme)['data']
    readme_content = relative_path_to_resolve_path 'code', readme_content
    render json: { readme: readme_content }
  rescue StarhubError
    render json: { readme: '' }
  end

  def create
    code = current_user.created_codes.build(code_params)
    if code.save
      render json: { path: code.path, message: I18n.t('repo.createSuccess') }, status: :created
    else
      render json: { message: code.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update
    if params[:private].to_s.present?
      @code.visibility = params[:private].to_s == 'true' ? 'private' : 'public'
    end

    @code.nickname = params[:nickname] if params[:nickname].present?
    @code.desc = params[:desc] if params[:desc].present?

    if @code.save
      render json: { message: I18n.t('repo.updateSuccess') }
    else
      render json: { message: I18n.t('repo.updateFailed') }, status: :bad_request
    end
  end

  def upload_file
    sync_upload_file('code', upload_options)
    render json: { message: I18n.t('repo.uploadFileSuccess') }, status: 200
  end

  private

  def code_params
    params.permit(:name, :nickname, :desc, :owner_id, :owner_type, :visibility, :license)
  end
end

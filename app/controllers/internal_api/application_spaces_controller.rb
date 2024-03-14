class InternalApi::ApplicationSpacesController < InternalApi::ApplicationController
  before_action :authenticate_user, except: [:index, :files, :readme]

  include Api::SyncStarhubHelper
  include Api::BuildCommitHelper
  include Api::FileOptionsHelper
  include Api::RepoValidation

  def files
    last_commit, files = Starhub.api.get_application_space_detail_files_data_in_parallel(params[:namespace], params[:application_space_name], files_options)
    render json: { last_commit: JSON.parse(last_commit)['data'], files: JSON.parse(files)['data'] }
  end

  def readme
    readme = Starhub.api.get_application_space_file_content(params[:namespace], params[:application_space_name], 'README.md')
    readme_content = JSON.parse(readme)['data']
    readme_content = relative_path_to_resolve_path 'model', readme_content
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

  private

  def create_params
    params.permit(:name, :nickname, :desc, :sdk, :cloud_resource, :owner_id, :owner_type, :visibility, :license, :cover_image)
  end
end

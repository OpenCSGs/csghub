module LocalRepoValidation
  extend ActiveSupport::Concern

  included do
    before_action only: [
      :show,
      :files,
      :blob,
      :new_file,
      :upload_file,
      :edit_file,
      :resolve,
      :community,
      :billing,
      :settings,
      :commits,
      :commit,
      :logs
    ] do
      local_repo_validation
    end
  end

  private

  def local_repo_validation
    get_owner_info
    type = controller_name
    get_local_repo(type)
    debugger
  end

  def get_owner_info
    @owner = User.find_by(name: params[:namespace]) || Organization.find_by(name: params[:namespace])
    @owner_url = helpers.code_repo_owner_url @owner
    @avatar_url = @owner&.avatar_url
  end

  def get_local_repo(type)
    case type
    when 'models'
      @local_model = @owner && @owner.models.find_by(name: params[:model_name])
    when 'datasets'
      @local_dataset = @owner && @owner.datasets.find_by(name: params[:dataset_name])
    when 'codes'
      @local_code = @owner && @owner.codes.find_by(name: params[:code_name])
    when 'application_spaces'
      @local_application_space = @owner && @owner.application_spaces.find_by(name: params[:application_space_name])
    when 'endpoints'
      @local_endpoint = @owner && @owner.endpoints.find_by(name: params[:endpoint_name])
    end
  end
end

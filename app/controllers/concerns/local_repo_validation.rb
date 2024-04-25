module LocalRepoValidation
  extend ActiveSupport::Concern

  included do
    before_action only: [:show, :files, :blob, :new_file, :upload_file, :edit_file, :resolve] do
      local_repo_validation
    end
  end

  private

  def local_repo_validation
    get_owner_info
    type = controller_name
    local_repo = get_local_repo(type)

    unless local_repo
      return redirect_to errors_not_found_path
    end

    if local_repo.send("#{type.singularize}_private?")
      if local_repo.owner.instance_of? User
        return redirect_to errors_unauthorized_path if local_repo.owner != current_user
      else
        return redirect_to errors_unauthorized_path unless current_user&.org_role(local_repo.owner)
      end
    end
  end

  def get_owner_info
    @owner = User.find_by(name: params[:namespace]) || Organization.find_by(name: params[:namespace])
    @owner_url = helpers.code_repo_owner_url @owner
    @avatar_url = @owner.avatar_url
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
    end
  end

  def repo_has_like?(repo, repotype)
    like_repos = JSON.parse(csghub_api.get_user_likes(current_user&.name, repotype, { current_user: current_user&.name}))["data"]
    return false if like_repos.blank?
    like_repo_id_list = like_repos.map { |like_repo| like_repo["repository_id"] }
    repo_id = JSON.parse(repo)["data"]["repository_id"]
    like_repo_id_list.include?(repo_id)
  end
end

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
    local_repo = get_local_repo(type)

    if local_repo
      if local_repo.send("#{type.singularize}_private?")
        if local_repo.owner.instance_of? User
          return redirect_to errors_unauthorized_path if local_repo.owner != current_user
        else
          return redirect_to errors_unauthorized_path unless current_user&.org_role(local_repo.owner)
        end
      end
    else
      return if true
      # 如果 @owner 不存在则不创建本地 repo
      # return unless @owner
      server_repo = JSON.parse(get_server_repo(type))
      server_repo_info = server_repo['data']
      # 多源同步的情况，不创建本地 repo
      return if server_repo_info['source'] != 'local'
      if server_repo['msg'] == 'OK'
        repo_visibility = if server_repo_info['private'].to_s == 'true'
                            'private'
                          else
                            'public'
                          end
        creator_id = if @owner.class.name == 'User' || current_user.nil?
                       @owner.id
                     else
                       current_user.id
                     end
        create_local_repo(type, repo_visibility, creator_id)
      else
        return redirect_to errors_not_found_path
      end
    end
  rescue StarhubError
    return redirect_to errors_not_found_path
  end

  def get_owner_info
    @owner = User.find_by(name: params[:namespace]) || Organization.find_by(name: params[:namespace])
    @owner_url = helpers.code_repo_owner_url @owner
    @avatar_url = @owner&.avatar_url
  end

  def create_local_repo(type, visibility, creator_id)
    repo_attributes = {
      owner_id: @owner.id,
      owner_type: @owner.class.name,
      license: 'apache-2.0',
      visibility: visibility,
      creator_id: creator_id,
      skip_create_callback: true
    }

    case type
    when 'models'
      repo_attributes[:name] = params['model_name']
      @local_model = Model.new(repo_attributes)
      @local_model.save
    when 'datasets'
      repo_attributes[:name] = params['dataset_name']
      @local_dataset = Dataset.new(repo_attributes)
      @local_dataset.save
    when 'codes'
      repo_attributes[:name] = params['code_name']
      @local_code = Code.new(repo_attributes)
      @local_code.save
    when 'application_spaces'
      repo_attributes[:name] = params['application_space_name']
      @local_application_space = ApplicationSpace.new(repo_attributes)
      @local_application_space.save
    end
  end

  def get_server_repo(type)
    case type
    when 'models'
      csghub_api.get_model_detail(params[:namespace], params[:model_name], {current_user: current_user&.name})
    when 'datasets'
      csghub_api.get_dataset_detail(params[:namespace], params[:dataset_name], {current_user: current_user&.name})
    when 'codes'
      csghub_api.get_code_detail(params[:namespace], params[:code_name], {current_user: current_user&.name})
    when 'application_spaces'
      csghub_api.get_application_space_detail(params[:namespace], params[:application_space_name], {current_user: current_user&.name})
    end
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

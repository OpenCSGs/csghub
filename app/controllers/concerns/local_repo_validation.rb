module LocalRepoValidation
  extend ActiveSupport::Concern

  included do
    before_action only: [:show, :files, :blob, :new_file, :upload_file, :edit_file, :resolve, :community, :settings, :commits, :commit] do
      local_repo_validation
    end

    before_action :validate_settings, only: [:settings]
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
      server_repo = JSON.parse(get_server_repo(type))
      if server_repo['msg'] == 'OK'
        server_repo_info = server_repo['data']
        creator_id = if @owner.class.name == 'User' || current_user.nil?
                       @owner.id
                     else
                       current_user.id
                     end
        create_local_repo(type, server_repo_info['private'], creator_id)
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
    @avatar_url = @owner.avatar_url
  end

  def create_local_repo(type, visibility, creator_id)
    case type
    when 'models'
      @local_model = Model.create!(owner_id: @owner.id,
                     owner_type: @owner.class.name,
                     name: params['model_name'],
                     license: 'apache-2.0',
                     visibility: visibility.to_s,
                     creator_id: creator_id)
    when 'datasets'
      @local_dataset = Dataset.create!(owner_id: @owner.id,
                       owner_type: @owner.class.name,
                       name: params['dataset_name'],
                       license: 'apache-2.0',
                       visibility: visibility.to_s,
                       creator_id: creator_id)
    when 'codes'
      @local_code = Code.create!(owner_id: @owner.id,
                    owner_type: @owner.class.name,
                    name: params['code_name'],
                    license: 'apache-2.0',
                    visibility: visibility.to_s,
                    creator_id: creator_id)
    when 'application_spaces'
      @local_application_space = ApplicationSpace.create!(owner_id: @owner.id,
                                 owner_type: @owner.class.name,
                                 name: params['application_space_name'],
                                 license: 'apache-2.0',
                                 visibility: visibility.to_s,
                                 creator_id: creator_id)
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
    end
  end

  def validate_settings
    type = controller_name
    local_repo = get_local_repo(type)

    unless current_user.can_manage?(local_repo)
      return redirect_to errors_unauthorized_path
    end
  end
end

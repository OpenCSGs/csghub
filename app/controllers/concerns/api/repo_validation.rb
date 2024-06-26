module Api::RepoValidation
  extend ActiveSupport::Concern

  included do
    before_action only: [:update, :destroy] do
      validate_manage(controller_name)
    end

    before_action only: [:upload_file] do
      validate_write(controller_name)
    end

    before_action only: [:files, :readme, :preview_parquet] do
      validate_authorization(controller_name)
    end

    before_action :validate_owner, only: [:create]
  end

  private

  def validate_repo(type)
    repo = get_repo(type)
    unless repo
      return render json: { message: "未找到对应仓库" }, status: 404
    end
  end

  def validate_manage(type)
    repo = get_repo(type)

    unless current_user.can_manage?(repo)
      render_unauthorized('无权限')
      return
    end
  end

  def validate_write(type)
    repo = get_repo(type)

    unless current_user.can_write?(repo)
      render_unauthorized('无权限')
      return
    end
  end

  def validate_owner
    if params[:owner_type] == 'User' && current_user.id.to_i != params[:owner_id].to_i
      render_unauthorized('用户不存在')
      return
    elsif params[:owner_type] == 'Organization'
      org = current_user.organizations.find_by(id: params[:owner_id])
      if !org || current_user.org_role(org) == 'read'
        render_unauthorized('组织不存在或无权限')
        return
      end
    end
  end

  def validate_authorization(type)
    local_repo = get_repo(type)

    return unless local_repo

    return render_unauthorized('无权限') unless valid_authorization?(local_repo, type)
  end

  def valid_authorization?(repo, type)
    return true if repo.send "#{type.singularize}_public?"

    return false unless helpers.logged_in?

    if repo.owner.instance_of?(User)
      return repo.owner == current_user
    end

    return current_user.org_role(repo.owner)
  end

  def render_unauthorized(message)
    render json: { message: message }, status: :unauthorized
  end

  def get_owner
    User.find_by(name: params[:namespace]) || Organization.find_by(name: params[:namespace])
  end

  def get_repo(type)
    owner = get_owner
    case type
    when 'models'
      @model = owner && owner.models.find_by(name: params[:model_name])
    when 'datasets'
      @dataset = owner && owner.datasets.find_by(name: params[:dataset_name])
    when 'codes'
      @code = owner && owner.codes.find_by(name: params[:code_name])
    when 'application_spaces'
      @application_space = owner && owner.application_spaces.find_by(name: params[:application_space_name])
    when 'endpoints'
      @endpoint = owner && owner.endpoints.find_by(name: params[:endpoint_name])
    end
  end
end

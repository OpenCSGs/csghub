class DatasetsController < ApplicationController
  layout 'new_application'

  before_action :check_user_info_integrity
  before_action :load_dataset_detail, only: [:show, :files, :blob]
  before_action :load_branch_and_path, only: [:files, :blob]

  def index
    response = {}
    Tag::DATASET_TAG_FIELDS.each do |field|
      response[field] = {}
      response[field][:color] = Tag::TAG_FIELD_COLOR_MAPPINGS[field][:color]
      response[field][:zh_name] = Tag::TAG_FIELD_COLOR_MAPPINGS[field][:zh_name]
      response[field][:tags] = Tag.where(tag_field: field)
    end
    @task_tags = response.as_json
    @framework_tags = Tag.where(tag_type: 'framework').as_json
    @license_tags = Tag.where(tag_type: 'license').as_json
  end

  def new
    @available_namespaces = current_user.available_namespaces
    system_config = SystemConfig.first
    license_configs = system_config.license_configs rescue nil
    @licenses = license_configs.presence || Model::DEFAULT_LICENSES
  end

  def show
    @default_tab = 'summary'
    @files = Starhub.api.get_datasets_files(params[:namespace], params[:dataset_name])
  end

  def files
    @files = Starhub.api.get_datasets_files(params[:namespace], params[:dataset_name], files_options)
    render :show
  end

  def blob
    @content = Starhub.api.get_datasets_file_content(params[:namespace], params[:dataset_name], params[:path], { ref: @current_branch })
    render :show
  end

  private

  def load_dataset_detail
    owner = User.find_by(name: params[:namespace]) || Organization.find_by(name: params[:namespace])
    @local_dataset = owner && owner.datasets.find_by(name: params[:dataset_name])
    unless @local_dataset
      flash[:alert] = "未找到数据集"
      return redirect_to "/datasets"
    end
    if @local_dataset.dataset_private?
      if @local_dataset.owner.instance_of? User
        return redirect_to errors_unauthorized_path if @local_dataset.owner != current_user
      else
        return redirect_to errors_unauthorized_path unless current_user.org_role(@local_dataset.owner)
      end
    end

    @avatar_url = owner.avatar_url
    @dataset = Starhub.api.get_datasets_detail(params[:namespace], params[:dataset_name])
    raw_tags = Starhub.api.get_datasets_tags(params[:namespace], params[:dataset_name])
    @tags = Tag.build_detail_tags(JSON.parse(raw_tags)['data']).to_json
    @last_commit = Starhub.api.get_datasets_last_commit(params[:namespace], params[:dataset_name])
    @branches = Starhub.api.get_datasets_branches(params[:namespace], params[:dataset_name])
    @readme = Starhub.api.get_datasets_file_content(params[:namespace], params[:dataset_name], 'README.md')
  end

  def load_branch_and_path
    @default_tab = 'files'
    @current_branch = params[:branch] || 'main'
    @current_path = params[:path] || ''
  end

  def files_options
    {
      ref: @current_branch,
      path: @current_path
    }
  end
end

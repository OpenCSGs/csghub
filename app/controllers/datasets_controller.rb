class DatasetsController < ApplicationController
  include TagListHelper
  include LicenseListHelper
  # Todo: remove later
  # include LocalRepoValidation
  include FileOptionsHelper
  include BlobContentHelper

  # Todo: remove later
  # before_action :check_user_info_integrity
  before_action :authenticate_user, only: [:new, :new_file, :upload_file, :edit_file, :settings]
  before_action :load_branch_and_path, except: [:index, :new]
  before_action :load_dataset_detail, except: [:index, :new, :resolve]

  def index
    get_tag_list('datasets')
  end

  def new
    get_license_list
  end

  def show
    @default_tab = 'summary'
  end

  def files
    @default_tab = 'files'
    render :show
  end

  def community
    @default_tab = 'community'
    render :show
  end

  def settings
    @default_tab = 'settings'
    render :show
  end

  def blob
    @default_tab = 'files'
    render :show
  end

  def resolve
    resolve_file_or_content(:download_dataset_resolve_file, :get_dataset_file_content, :dataset_name)
  end

  def upload_file
    @default_tab = 'files'
    render :show
  end

  def new_file
    @default_tab = 'files'
    render :show
  end

  def edit_file
    @default_tab = 'files'
    render :show
  end

  def commits
    @default_tab = 'files'
    render :show
  end

  def commit
    @default_tab = 'files'
    @commit_id = params[:commit_id]
    render :show
  end

  private

  def load_dataset_detail
    @tags_list = Tag.where(scope: 'dataset', tag_type: 'task').as_json
    # Todo: remove later
    # @settings_visibility = (current_user && @local_dataset) ? current_user.can_manage?(@local_dataset) : false
  end
end

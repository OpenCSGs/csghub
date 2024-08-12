class ApplicationSpacesController < ApplicationController
  include LocalRepoValidation
  include TagListHelper
  include LicenseListHelper
  include FileOptionsHelper
  include BlobContentHelper

  before_action :authenticate_user, only: [:show, :new, :new_file, :upload_file, :edit_file, :settings]
  before_action :load_branch_and_path, except: [:index, :new]

  def index
    get_tag_list('application_spaces')
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

  def billing
    @default_tab = 'billing'
    render :show
  end

  def blob
    @default_tab = 'files'
    render :show
  end

  def resolve
    resolve_file_or_content(:download_application_space_resolve_file, :get_application_space_file_content, :application_space_name)
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
end

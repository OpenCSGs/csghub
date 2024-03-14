class CodesController < ApplicationController
  include TagListHelper
  include LicenseListHelper

  layout 'new_application'

  before_action :check_user_info_integrity
  before_action :authenticate_user, only: [:new]

  def index
    get_tag_list('codes')
  end

  def new
    @available_namespaces = current_user.available_namespaces
    get_license_list
  end
end

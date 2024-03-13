class CodesController < ApplicationController
  include LicenseListHelper

  layout 'new_application'

  before_action :check_user_info_integrity
  before_action :authenticate_user, only: [:new]

  def new
    @available_namespaces = current_user.available_namespaces
    get_license_list
  end
end

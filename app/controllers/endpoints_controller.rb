class EndpointsController < ApplicationController
  layout 'repo_application'

  include LocalRepoValidation

  before_action :authenticate_user, except: :show
  before_action :check_user_info_integrity
  before_action :load_endpoint_detail, except: :new

  def new
  end

  def show
    @default_tab = 'summary'
  end

  def logs
    @default_tab = 'logs'
    render :show
  end

  def billing
    @default_tab = 'billing'
    render :show
  end

  def settings
    @default_tab = 'settings'
    render :show
  end

  private

  def load_endpoint_detail
    @settings_visibility = (current_user && @local_endpoint) ? current_user.can_manage?(@local_endpoint) : false
  end
end

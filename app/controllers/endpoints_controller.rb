class EndpointsController < ApplicationController
  include LocalRepoValidation

  before_action :check_user_info_integrity
  before_action :authenticate_user
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

  def settings
    @default_tab = 'settings'
    render :show
  end

  private

  def load_endpoint_detail
    @endpoint = csghub_api.get_endpoint_detail(params[:namespace],
                                               params[:model_name],
                                               params[:endpoint_id],
                                               {
                                                 current_user: current_user&.name
                                               })
    @settings_visibility = current_user ? current_user.can_manage?(@local_endpoint) : false
  end
end

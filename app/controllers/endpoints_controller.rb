class EndpointsController < ApplicationController
  before_action :authenticate_user
  # Todo: remove later
  # before_action :check_user_info_integrity

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
end

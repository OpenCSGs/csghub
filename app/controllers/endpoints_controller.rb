class EndpointsController < ApplicationController
  include LocalRepoValidation

  before_action :authenticate_user

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

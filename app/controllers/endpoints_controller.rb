class EndpointsController < ApplicationController
  include LocalRepoValidation

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
end

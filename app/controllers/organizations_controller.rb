class OrganizationsController < ApplicationController
  before_action :authenticate_user, except: [:show]

  def edit
    @name = params[:id]
  end

  def new
  end

  def show
    @name = params[:id]
  end

  def members
    @name = params[:id]
  end
end

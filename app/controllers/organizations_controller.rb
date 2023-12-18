class OrganizationsController < ApplicationController
  before_action :authenticate_user

  def new
  end

  def show
    @organization = Organization.find_by(name: params[:id])
    unless @organization
      flash[:alert] = "未找到对应的组织"
      return redirect_to "/profile/#{current_user.name}"
    end
    @members = @organization.users
    @models = @organization.models
  end
end

class EndpointsController < ApplicationController
  before_action :check_user_info_integrity
  before_action :authenticate_user, only: [:new]

  def new
  end
end

class ModelsController < ApplicationController
  before_action :check_user_info_integrity

  def index
  end

  def show
    @model = Starhub.api.get_model_detail(params[:user_name], params[:model_name])
    @files = Starhub.api.get_model_files(params[:user_name], params[:model_name])
    @last_commit = Starhub.api.get_last_commit(params[:user_name], params[:model_name])
    @branches = Starhub.api.get_model_branches(params[:user_name], params[:model_name])
  end

  private

  def check_user_info_integrity
    return unless helpers.logged_in?

    if current_user.email.blank?
      flash[:alert] = "请补充邮箱，以便能使用完整的功能"
      return redirect_to '/settings/profile'
    end

    unless current_user.starhub_synced?
      current_user.sync_to_starhub_server
    end
  end
end

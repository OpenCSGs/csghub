class SpacesController < ApplicationController
  def index
    # 重置为全部应用
    cookies[:mySpaces] = 'false'
    @total_spaces = policy_scope(Space).order(created_at: :desc)
    @spaces = @total_spaces.page params[:page]
  end

  def show
    @space = Space.find_by!(space_starchain_id: params[:id])
    authorize @space
    @comments = @space.comments.order(created_at: :desc).includes(:user).map(&:as_json)
  end

  def stopped
    render 'stopped', layout: 'login'
  end
end

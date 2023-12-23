class SpacesController < ApplicationController
  before_action :authenticate_user, except: :index

  def index
    # 重置为全部应用
    cookies[:mySpaces] = 'false'
    @total_spaces = policy_scope(Space).order(created_at: :desc)
    @spaces = @total_spaces.page params[:page]
  end

  def show
    @space = space
    @comments = space.comments.order(created_at: :desc).includes(:user).map(&:as_json)
  end

  def stopped
    render 'stopped', layout: 'login'
  end

  private

  def space
    @space ||= Space.find_by!(space_starchain_id: params[:id])
  end
end

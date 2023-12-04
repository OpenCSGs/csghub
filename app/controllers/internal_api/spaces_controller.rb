class InternalApi::SpacesController < ApplicationController
  def index
    @total_spaces = policy_scope(Space).order(created_at: :desc)
    @total_spaces = @total_spaces.where(user_id: current_user.id) if cookies[:mySpaces] == 'true'
    @spaces = @total_spaces.page(params[:page])
    render json: {spaces: @spaces.to_json, total_cards: @total_spaces.count}
  end
end

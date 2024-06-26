class InternalApi::Admin::UsersController < InternalApi::Admin::ApplicationController
  before_action :find_user, only: [:show, :recharge]

  def index
    if params[:keyword].present?
      @users = User.where(
        search_columns.map { |column| "#{column} LIKE :keyword" }.join(" OR "),
        keyword: "%#{params[:keyword]}%"
      ).page(params[:page]).per(params[:per])
    else
      @users = User.all.page(params[:page]).per(params[:per])
    end
    render json: { users: @users, total_count: @users.total_count }
  end

  def show
    render json: @user.to_json
  end

  def recharge
    render json: Starhub::api.user_recharge(@user.login_identity, current_user.login_identity, current_user.name, params[:value].to_i)
  end

  private

  def user_params
    params.permit(:name, :email, :phone)
  end

  def find_user
    @user = User.find_by(id: params[:id])
    return render json: { message: "User not found" }, status: :not_found unless @user
  end

  def search_columns
    %w[name email phone nickname login_identity]
  end
end

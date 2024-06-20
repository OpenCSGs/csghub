class InternalApi::Admin::UsersController < InternalApi::Admin::ApplicationController
  before_action :find_user, only: [:show]

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

  private

  def user_params
    params.permit(:name, :email, :phone)
  end

  def find_user
    @user = User.find(params[:id])
  end

  def search_columns
    %w[name email phone nickname]
  end
end

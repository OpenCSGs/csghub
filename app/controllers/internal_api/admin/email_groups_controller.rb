class InternalApi::Admin::EmailGroupsController < InternalApi::ApplicationController
  def index
    offset = params[:per_page].to_i * (params[:page].to_i - 1)
    total_email_groups = EmailGroup.count
    @email_groups = EmailGroup.order('created_at').limit(params[:per_page]).offset(offset)
    render json: { total: total_email_groups, email_groups: @email_groups}
  end

  def create
    email_group = EmailGroup.new(email_group_params)
    if email_group.save
      render json: {msg: 'Create email group success'}
    else
      render json: {msg: 'Failed to create email group'}, status: 400
    end
  end

  private

  def email_group_params
    params.permit(:name, :email_list)
  end
end

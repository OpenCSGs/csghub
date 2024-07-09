class InternalApi::Admin::EmailGroupsController < InternalApi::ApplicationController
  def index
    @email_groups = EmailGroup.all
    render json: { email_groups: @email_groups}
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

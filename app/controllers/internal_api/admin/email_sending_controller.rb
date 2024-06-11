class InternalApi::Admin::EmailSendingController < InternalApi::ApplicationController
  def group_mail
    SystemNotificationMailer.with(
                              mail_group: params[:group],
                              mail_template: params[:template]
                            ).delay
                             .group_mail
    render json: { message: "Group mail has been sent"}
  end
end

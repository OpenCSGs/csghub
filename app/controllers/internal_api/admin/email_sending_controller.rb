class InternalApi::Admin::EmailSendingController < InternalApi::ApplicationController
  def create
    email_list.each do |email|
      mail_address = Mail::Address.new(email)
      is_mail_address_valid = mail_address.domain && mail_address.address == email
      if is_mail_address_valid
        SystemNotificationMailer.with(
                                  email: email,
                                  mail_template: params[:template]
                                ).group_mail.deliver_now
      end
    end
    render json: { message: "Group mail has been sent"}
  end

  private

  def email_list
    if params[:group] == 'all'
      User.pluck(:email).compact_blank
    else
      email_group = EmailGroup.find_by(name: params[:group])
      return [] unless email_group
      email_group.email_list.split(',')
    end
  end
end

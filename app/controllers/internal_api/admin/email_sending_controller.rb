class InternalApi::Admin::EmailSendingController < InternalApi::ApplicationController
  def group_mail
    if params[:group] == 'all'
      User.pluck(:email).reject! { |item| item.nil? || item.empty? }.each do |email|
        mail_address = Mail::Address.new(email)
        is_mail_address_valid = mail_address.domain && mail_address.address == email
        if is_mail_address_valid
          SystemNotificationMailer.with(
                                    email: email,
                                    mail_template: params[:template]
                                  ).delay.group_mail
        end
      rescue Net::SMTPFatalError
        next
      end
    end
    render json: { message: "Group mail has been sent"}
  end
end

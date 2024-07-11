class InternalApi::LeadsController < InternalApi::ApplicationController
  def create
    lead = Lead.new(create_params)

    if lead.save
      render json: { message: "线索创建成功" }
    else
      render json: { message: lead.errors.full_messages.to_sentence }, status: :bad_request
    end
  end

  private

  def create_params
    params.require(:lead).permit(:name, :title, :phone, :company, :expertise, :introduction, :email, :user_channel, :company_site, :industry, :lead_source, :lead_type)
  end
end

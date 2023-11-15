class Api::LeadsController < Api::ApplicationController
  skip_before_action :set_current_user

  def create
    lead = Lead.new(create_params)

    if lead.save
      render json: { message: "线索创建成功" }
    else
      render json: { message: lead.errors.full_messages.first.split(' ')[1] }, status: :bad_request
    end
  end

  private

  def create_params
    params.require(:lead).permit(:name, :title, :phone, :company, :expertise, :introduction, :email, :company_site, :industry, :lead_source, :lead_type)
  end
end


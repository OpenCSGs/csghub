class Api::LeadsController < Api::ApplicationController

  def create_params
    params.require(:lead).permit(:name, :title, :phone, :company, :expertise, :introduction, :email, :company_site, :industry, :lead_source, :lead_type)
  end

  def create
    lead = Lead.new(create_params)

    if lead.save
      render json: { message: "Lead created" }
    else
      if Lead.find_by(phone: create_params[:phone], lead_type: create_params[:lead_type])
        render json: { message: "手机号已存在" }, status: :bad_request
      else
        render json: { message: "未包含必填字段" }, status: :bad_request
      end
    end
  end
end


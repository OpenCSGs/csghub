class LeadsController < ApplicationController
  before_action :check_lead_form_status, only: [:create]

  def create
    if @lead.save
      redirect_to thank_you_lead_forms_path
    else
      flash[:alert] = @lead.errors.full_messages.first || "请填写完整的信息"
      redirect_to current_lead_form_path
    end
  end

  private

  def check_lead_form_status
    @lead = Lead.new(lead_params)
    unless @lead.lead_form.active?
      flash[:alert] = "活动已结束申请"
      redirect_to current_lead_form_path and return
    end
  end

  def current_lead_form_path
    session[:original_request_path] + '#error'
  end

  def lead_params
    params.permit(
      *LeadForm.available_form_fields,
      :lead_form_uuid,
      :channel,
      :lead_source,
      :lead_type,
      :utm_content,
      :utm_medium,
      :utm_source,
      :utm_keyword
    )
  end
end
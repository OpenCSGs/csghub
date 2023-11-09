class LeadFormsController < ApplicationController
  before_action :remember_lead_form, except: [:thank_you]
  before_action :init_lead, except: [:thank_you]

  def show_form
    uuid = params[:uuid].split('_').first
    @lead_form = LeadForm.find_by!(uuid: uuid)
    flash[:alert] = "活动已结束申请" if @lead_form.inactive?
  end

  def thank_you
  end

  private

  def init_lead
    @lead = Lead.new
    # 这四个信息在 LeadForm 创建的时候是不会配置的，因为一个 LeadForm 可能会用到多个地方
    @lead.utm_content = params['utm_content']
    @lead.utm_medium = params['utm_medium']
    @lead.utm_source = params['utm_source']
    @lead.utm_keyword = params['utm_keyword']
  end

  def remember_lead_form
    session[:original_request_path] = request.fullpath
  end

  def lead_form_params
    params.permit(:title, :internal_title, :description, :lead_source, :channel, :lead_status, lead_fields: [], custom_required_fields: [])
  end
end

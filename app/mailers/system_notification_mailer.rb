# frozen_string_literal: true

class SystemNotificationMailer < ApplicationMailer
  before_action :set_lead

  def new_partner_alert
    mail(to: internal_group,
    subject: "#{subject_prefix}: 合作伙伴申请")
  end

  def new_expert_alert
    mail(to: internal_group,
    subject: "#{subject_prefix}: 专家申请")
  end

  def new_customer_alert
    mail(to: internal_group,
    subject: "#{subject_prefix}: 新客户申请")
  end

  private

  def set_lead
    @lead = Lead.find params[:lead_id]
  end
end

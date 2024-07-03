class Lead < ApplicationRecord
  PHONE_REGEX = /\A\d{7,11}\Z/

  enum lead_status: {
    processing: 'processing',
    completed: 'completed'
  }

  enum origin: {
    exhibition: 'exhibition',
    public_number: 'public_number',
    video_number: 'video_number',
    zhihu: 'zhihu',
    baidu: 'baidu',
    friends: 'friends',
    other: 'other'
  }

  belongs_to :lead_form, primary_key: :uuid, foreign_key: :lead_form_uuid, optional: true

  validates_presence_of :company, :phone, :name, :position

  validates_uniqueness_of :phone, scope: :lead_type

  validate :custom_required_fields_presence

  after_create :send_lead_alert

  def custom_required_fields_presence
    return unless lead_form

    required_fields = lead_form.custom_required_fields & lead_form.lead_fields
    return unless required_fields

    required_fields.each do |lead_field|
      errors.add(lead_field, "请填写完整表单") unless send(lead_field).present?
    end
  end

  private

  def send_lead_alert
    case lead_type
    when 'partners'
      SystemNotificationMailer.with(lead_id: id).new_partner_alert.deliver_now
    when 'experts'
      SystemNotificationMailer.with(lead_id: id).new_expert_alert.deliver_now
    when 'customer'
      SystemNotificationMailer.with(lead_id: id).new_customer_alert.deliver_now
    else
      'do nothing'
    end
  end
end

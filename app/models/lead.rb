class Lead < ApplicationRecord
  PHONE_REGEX = /\A\d{7,11}\Z/

  belongs_to :lead_form, primary_key: :uuid, foreign_key: :lead_form_uuid, optional: true

  validates_presence_of :company, :phone, :name

  validates_uniqueness_of :phone, scope: :lead_type

  validate :custom_required_fields_presence

  def custom_required_fields_presence
    return unless lead_form

    required_fields = lead_form.custom_required_fields & lead_form.lead_fields
    return unless required_fields

    required_fields.each do |lead_field|
      errors.add(lead_field, "请填写完整表单") unless send(lead_field).present?
    end
  end
end

class LeadForm < ApplicationRecord
  include UuidConcern

  serialize :lead_fields, JSON
  serialize :custom_required_fields, JSON
  before_create :set_default_status
  paginates_per 15

  enum lead_form_status: { active: 'active', inactive: 'inactive' }

  belongs_to :campaign
  has_many :leads, primary_key: :uuid, foreign_key: :lead_form_uuid

  def self.available_form_fields
    [
      'name',
      'phone',
      'company',
      'email',
      'user_channel',
      'title',
      'industry',
      'province',
      'email_opt_out',
      'num_of_employees',
      'additional_notes',
      'computing_demand',
      'demand'
    ]
  end

  def self.required_form_fields
    [
      'name',
      'phone',
      'company'
    ]
  end

  def form_url
    LEAD_FORM_HOST + "/lead_forms/form/#{self.uuid}_#{self.title.gsub(/\s+/, '_')}"
  end

  def toggle_lead_form_status!
    case lead_form_status
    when 'active'
      inactive!
    when 'inactive'
      active!
    end
  end

  private

  def set_default_status
    self.local_channel = 'lead_form'
    self.lead_type = 'customer'
    self.lead_form_status = 'inactive'
  end
end

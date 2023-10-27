class LandingPage < ApplicationRecord
  serialize :lead_fields, JSON
  serialize :custom_required_fields, JSON
  before_create :set_default_status
  paginates_per 15

  enum landing_page_status: { active: 'active', inactive: 'inactive' }

  has_many :leads, primary_key: :uuid, foreign_key: :landing_page_uuid

  def self.available_form_fields
    [
      'name',
      'phone',
      'company',
      'email',
      'title',
      'industry',
      'province',
      'email_opt_out',
      'num_of_employees',
      'additional_notes'
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
    LANDING_PAGE_HOST + "/landing_pages/form/#{self.uuid}_#{self.title.gsub(/\s+/, '_')}"
  end

  def toggle_landing_page_status!
    case landing_page_status
    when 'active'
      inactive!
    when 'inactive'
      active!
    end
  end

  private

  def set_default_status
    self.local_channel = 'landinge_page'
    self.uuid = SecureRandom.base58(8)
  end
end

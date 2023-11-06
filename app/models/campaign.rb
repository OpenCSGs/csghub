class Campaign < ApplicationRecord
  include UuidConcern

  enum campaign_type: {
    live_competition: 0,
    training_camp: 1
  }

  has_rich_text :content

  before_create :set_uuid

  has_one :lead_form

  has_many :leads, through: :lead_form

  scope :without_lead_form, -> { includes(:lead_form).where(lead_forms: { id: nil }) }

  def set_uuid
    self.uuid = SecureRandom.base58(12)
  end

  def with_content_and_leads_count
    attributes.merge(content: content.body.to_plain_text.squish, leads_count: leads.count)
  end
end

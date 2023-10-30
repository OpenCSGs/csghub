class Campaign < ApplicationRecord
  include UuidConcern

  has_rich_text :content

  before_create :set_uuid

  has_one :lead_form

  scope :without_lead_form, -> { includes(:lead_form).where(lead_forms: { id: nil }) }

  def set_uuid
    self.uuid = SecureRandom.base58(12)
  end
end

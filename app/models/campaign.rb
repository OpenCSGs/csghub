class Campaign < ApplicationRecord
  include UuidConcern

  LIVE_COMPETITION = '直播比赛'.freeze
  TRAINING_CAMP = '创作训练营'.freeze

  CAMPAIGN_TYPES = [LIVE_COMPETITION, TRAINING_CAMP].freeze

  has_rich_text :content

  before_create :set_uuid

  has_one :lead_form

  scope :without_lead_form, -> { includes(:lead_form).where(lead_forms: { id: nil }) }

  def set_uuid
    self.uuid = SecureRandom.base58(12)
  end
end

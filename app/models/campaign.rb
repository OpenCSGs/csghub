class Campaign < ApplicationRecord
  include UuidConcern
  include Rails.application.routes.url_helpers

  enum campaign_type: {
    live_competition: 0,
    training_camp: 1
  }

  # 特别强调：这里的顺序不能打乱，新的状态依次放在最后
  enum status: [:prestart,
                :signing_up,
                :in_progress,
                :ended]

  has_rich_text :content

  has_one_attached :desktop_banner
  has_one_attached :mobile_banner

  before_create :set_uuid

  has_one :lead_form

  has_many :leads, through: :lead_form

  scope :without_lead_form, -> { includes(:lead_form).where(lead_forms: { id: nil }) }
  scope :recommended, -> { where(recommended: true) }

  def set_uuid
    self.uuid = SecureRandom.base58(12)
  end

  def with_content_and_leads_count
    attributes.merge(
      content: content.body.to_plain_text.squish,
      leads_count: leads.count,
      start_date: start_date.to_date,
      end_date: end_date.to_date
    )
  end

  def with_blob_path(obj)
    obj.attached? ? rails_blob_path(obj, disposition: "inline", only_path: true) : nil
  end

  def banner_attributes
    attributes.slice('uuid').merge(desktop_banner_url: with_blob_path(desktop_banner), mobile_banner_url: with_blob_path(mobile_banner))
  end
end

class Campaign < ApplicationRecord
  has_rich_text :content

  before_create :set_uuid

  def set_uuid
    self.uuid = SecureRandom.base58(12)
  end
end

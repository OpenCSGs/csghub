module UuidConcern
  extend ActiveSupport::Concern

  included do
    before_create :set_uuid

    private

    def set_uuid
      self.uuid = SecureRandom.base58(12)
    end
  end
end
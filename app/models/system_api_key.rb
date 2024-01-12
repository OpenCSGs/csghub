class SystemApiKey < ApplicationRecord
  validates_presence_of :service

  before_create do
    self.secret_key = SecureRandom.base64(128)
  end
end

class SystemApiKey < ApplicationRecord
  validate_presence_of :service, :secret_key

  before_create :initialize_key

  def initialize_key
    self.secret_key = SecureRandom.base64(128)
  end
end

module Starhub
  def self.api
    @api ||= Starhub::Api.new
  end
end

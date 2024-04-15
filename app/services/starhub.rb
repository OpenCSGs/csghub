module Starhub
  def self.api user_ip = ""
    @api ||= Starhub::Api.new user_ip
  end
end

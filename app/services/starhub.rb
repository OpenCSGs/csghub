module Starhub
  def self.api user_ip = ""
    Starhub::Api.new user_ip
  end
end

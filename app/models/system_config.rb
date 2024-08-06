class SystemConfig < ApplicationRecord
  def license_info=(value)
    self[:license_info] = value.is_a?(String) ? JSON.parse(value) : value
  end
end

class SystemConfig < ApplicationRecord
  def s3_configs=(value)
    self[:s3_configs] = value.is_a?(String) ? JSON.parse(value) : value
  end

  def license_info=(value)
    self[:license_info] = value.is_a?(String) ? JSON.parse(value) : value
  end
end

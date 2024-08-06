class SystemConfig < ApplicationRecord
  def feature_flags=(value)
    self[:feature_flags] = value.is_a?(String) ? JSON.parse(value) : value
  end

  def s3_configs=(value)
    self[:s3_configs] = value.is_a?(String) ? JSON.parse(value) : value
  end

  def license_info=(value)
    self[:license_info] = value.is_a?(String) ? JSON.parse(value) : value
  end
end

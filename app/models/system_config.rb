class SystemConfig < ApplicationRecord
  def oidc_configs=(value)
    self[:oidc_configs] = value.is_a?(String) ? JSON.parse(value) : value
  end

  def starhub_configs=(value)
    self[:starhub_configs] = value.is_a?(String) ? JSON.parse(value) : value
  end

  def license_configs=(value)
    self[:license_configs] = value.is_a?(String) ? JSON.parse(value) : value
  end

  def feature_flags=(value)
    self[:feature_flags] = value.is_a?(String) ? JSON.parse(value) : value
  end

  def general_configs=(value)
    self[:general_configs] = value.is_a?(String) ? JSON.parse(value) : value
  end
end

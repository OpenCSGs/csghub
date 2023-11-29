class SystemConfig < ApplicationRecord
  def oidc_configs=(value)
    self[:oidc_configs] = value.is_a?(String) ? JSON.parse(value) : value
  end

  def starhub_configs=(value)
    self[:starhub_configs] = value.is_a?(String) ? JSON.parse(value) : value
  end
end

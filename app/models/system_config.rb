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

  def s3_configs=(value)
    self[:s3_configs] = value.is_a?(String) ? JSON.parse(value) : value
  end

  def hot_models=(value)
    self[:hot_models] = value.is_a?(String) ? JSON.parse(value) : value
  end

  def hot_datasets=(value)
    self[:hot_datasets] = value.is_a?(String) ? JSON.parse(value) : value
  end

  def hot_spaces=(value)
    self[:hot_spaces] = value.is_a?(String) ? JSON.parse(value) : value
  end

  def ignore_model_tags=(value)
    self[:ignore_model_tags] = value.is_a?(String) ? JSON.parse(value) : value
  end

  def ignore_dataset_tags=(value)
    self[:ignore_dataset_tags] = value.is_a?(String) ? JSON.parse(value) : value
  end

  def internal_mail_group=(value)
    self[:internal_mail_group] = value.is_a?(String) ? JSON.parse(value) : value
  end

  def latest_news=(value)
    self[:latest_news] = value.is_a?(String) ? JSON.parse(value) : value
  end

  def computing_partners=(value)
    self[:computing_partners] = value.is_a?(String) ? JSON.parse(value) : value
  end

  def customers=(value)
    self[:customers] = value.is_a?(String) ? JSON.parse(value) : value
  end

  def license_info=(value)
    self[:license_info] = value.is_a?(String) ? JSON.parse(value) : value
  end
end

module LicenseListHelper
  extend ActiveSupport::Concern

  private

  def get_license_list
    system_config = SystemConfig.first
    license_configs = system_config.license_configs rescue nil
    @licenses = license_configs.presence || Model::DEFAULT_LICENSES
  end
end

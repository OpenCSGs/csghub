module LicenseListHelper
  extend ActiveSupport::Concern

  private

  def get_license_list
    @licenses = Model::DEFAULT_LICENSES
  end
end

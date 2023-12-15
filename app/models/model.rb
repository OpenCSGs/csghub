class Model < ApplicationRecord
  DEFAULT_LICENSES = {
    apache_2_0: 'Apache License 2.0',
    mit: 'MIT',
    lgpl: 'GNU Lesser General Public License family',
    lgpl_2_1: 'GNU Lesser General Public License v2.1',
    lgpl_3_0: 'GNU Lesser General Public License v3.0',
    gpl: 'GNU General Public License family',
    gpl_2_0: 'GNU General Public License v2.0',
    gpl_3_0: 'GNU General Public License v3.0',
    afl_3_0: 'Academic Free License v3.0',
    ecl_2_0: 'Educational Community License v2.0',
    cc_by_4_0: 'Creative Commons Attribution 4.0',
    cc_by_nc_nd_3_0: 'Creative Commons Attribution Non Commercial No Derivatives 3.0',
    cc_by_nc_nd_4_0: 'Creative Commons Attribution Non Commercial No Derivatives 4.0',
    creativeml_openrail_m: 'CreativeML OpenRAIL-M',
    agpl_3_0: 'GNU Affero General Public License v3.0',
    cc_by_nc_4_0: 'Creative Commons Attribution Non Commercial 4.0',
    cc_by_nc_sa_2_0: 'Creative Commons Attribution Non Commercial Share Alike 2.0',
    cc_by_nc_sa_3_0: 'Creative Commons Attribution Non Commercial Share Alike 3.0',
    cc_by_nc_sa_4_0: 'Creative Commons Attribution Non Commercial Share Alike 4.0',
    other: 'Other'
  }

  enum :visibility, { model_public: 'public', model_private: 'private' }, default: :model_private

  belongs_to :owner, polymorphic: true
  belongs_to :creator, class_name: 'User', foreign_key: :creator_id

  validates :name, format: { with: /\A(?=.{2,20}$)(?!.*[_]{2})(?!.*[-]{2})[a-zA-Z0-9_-]+\Z/ }

  def path
    "#{owner.name}/#{name}"
  end
end

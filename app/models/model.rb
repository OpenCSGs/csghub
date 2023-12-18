class Model < ApplicationRecord
  DEFAULT_LICENSES = {
    apache_2_0: 'apache-2.0',
    mit: 'mit',
    lgpl: 'lgpl',
    lgpl_2_1: 'lgpl-2.1',
    lgpl_3_0: 'lgpl-3.0',
    gpl: 'gpl',
    gpl_2_0: 'gpl-2.0',
    gpl_3_0: 'gpl-3.0',
    afl_3_0: 'afl-3.0',
    ecl_2_0: 'ecl-2.0',
    cc_by_4_0: 'cc-by-4.0',
    cc_by_nc_nd_3_0: 'cc-by-nc-nd-3.0',
    cc_by_nc_nd_4_0: 'cc-by-nc-nd-4.0',
    creativeml_openrail_m: 'creativeml-openrail-m',
    agpl_3_0: 'agpl-3.0',
    cc_by_nc_4_0: 'cc-by-nc-4.0',
    cc_by_nc_sa_2_0: 'cc-by-nc-sa-2.0',
    cc_by_nc_sa_3_0: 'cc-by-nc-sa-3.0',
    cc_by_nc_sa_4_0: 'cc-by-nc-sa-4.0',
    other: 'Other'
  }

  enum :visibility, { model_public: 'public', model_private: 'private' }, default: :model_private

  belongs_to :owner, polymorphic: true
  belongs_to :creator, class_name: 'User', foreign_key: :creator_id

  after_create :sync_created_model_to_starhub_server
  after_destroy :delete_model_from_starhub_server

  validates :name, format: { with: /\A(?=.{2,20}$)(?!.*[_]{2})(?!.*[-]{2})[a-zA-Z0-9_-]+\Z/ }

  def path
    "#{owner.name}/#{name}"
  end

  private

  def sync_created_model_to_starhub_server
    Starhub.api.create_model(creator.name, name, owner.name)
  end

  def delete_model_from_starhub_server
    res = Starhub.api.delete_model(owner.name, name)
    raise ActiveRecord::Rollback unless res.success?
  end
end

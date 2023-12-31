class Model < ApplicationRecord
  DEFAULT_LICENSES = {
    'apache-2.0' => 'apache-2.0',
    'mit' => 'mit',
    'lgpl' => 'lgpl',
    'lgpl-2.1' => 'lgpl-2.1',
    'lgpl-3.0' => 'lgpl-3.0',
    'gpl' => 'gpl',
    'gpl-2.0' => 'gpl-2.0',
    'gpl-3.0' => 'gpl-3.0',
    'afl-3.0' => 'afl-3.0',
    'ecl-2.0' => 'ecl-2.0',
    'cc-by-4.0' => 'cc-by-4.0',
    'cc-by-nc-nd-3.0' => 'cc-by-nc-nd-3.0',
    'cc-by-nc-nd-4.0' => 'cc-by-nc-nd-4.0',
    'creativeml-openrail-m' => 'creativeml-openrail-m',
    'agpl-3.0' => 'agpl-3.0',
    'cc-by-nc-4.0' => 'cc-by-nc-4.0',
    'cc-by-nc-sa-2.0' => 'cc-by-nc-sa-2.0',
    'cc-by-nc-sa-3.0' => 'cc-by-nc-sa-3.0',
    'cc-by-nc-sa-4.0' => 'cc-by-nc-sa-4.0',
    'other' => 'other'
  }

  enum :visibility, { model_public: 'public', model_private: 'private' }, default: :model_private

  belongs_to :owner, polymorphic: true
  belongs_to :creator, class_name: 'User', foreign_key: :creator_id
  has_many :discussions, as: :discussionable, dependent: :destroy

  after_create :sync_created_model_to_starhub_server
  after_destroy :delete_model_from_starhub_server
  after_update :update_starhub_server_model
  before_save :detect_sensitive_content

  validates :name, format: { with: /\A(?=.{2,70}$)(?!.*[_]{2})(?!.*[-]{2})(?!.*[.]{2})[a-zA-Z0-9_.-]+\Z/ }

  validates :name, uniqueness: { scope: [:owner_type, :owner_id] }

  def path
    "#{owner.name}/#{name}"
  end

  def as_json options=nil
    {
      id: id,
      name: name,
      visibility: visibility,
      license: license,
      path: path,
      updated_at: updated_at
    }
  end

  private

  def sync_created_model_to_starhub_server
    res = Starhub.api.create_model(creator.name,
                                   name,
                                   owner.name,
                                   { license: license,
                                     private: model_private? })
    raise StarhubError, res.body unless res.success?
  end

  def delete_model_from_starhub_server
    res = Starhub.api.delete_model(owner.name, name)
    raise StarhubError, res.body unless res.success?
  end

  def update_starhub_server_model
    res = Starhub.api.update_model(creator.name,
                                   name,
                                   owner.name,
                                   { private: model_private? })
    raise StarhubError, res.body unless res.success?
  end

  def detect_sensitive_content
    Starhub.api.text_secure_check('nickname_detection', name)
  end
end

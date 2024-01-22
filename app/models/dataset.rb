class Dataset < ApplicationRecord
  enum :visibility, { dataset_public: 'public', dataset_private: 'private' }, default: :dataset_private

  belongs_to :owner, polymorphic: true
  belongs_to :creator, class_name: 'User', foreign_key: :creator_id
  has_many :discussions, as: :discussionable, dependent: :destroy

  after_create :sync_created_dataset_to_starhub_server
  after_destroy :delete_dataset_from_starhub_server
  before_save :detect_sensitive_content
  after_update :update_starhub_server_dataset

  validates :name, format: { with: /\A(?=.{2,70}$)(?!.*[_]{2})(?!.*[-]{2})(?!.*[.]{2})[a-zA-Z0-9_.-]+\Z/ }

  validates :name, uniqueness: { scope: [:owner_type, :owner_id], case_sensitive: false }

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

  def sync_created_dataset_to_starhub_server
    res = Starhub.api.create_dataset(creator.name, name, owner.name, { license: license, private: dataset_private?  })
    raise StarhubError, res.body unless res.success?
  end

  def update_starhub_server_dataset
    res = Starhub.api.update_dataset(creator.name,
                                     name,
                                     owner.name,
                                     { private: dataset_private? })
    raise StarhubError, res.body unless res.success?
  end

  def delete_dataset_from_starhub_server
    res = Starhub.api.delete_dataset(owner.name, name)
    raise StarhubError, res.body unless res.success?
  end

  def detect_sensitive_content
    Starhub.api.text_secure_check('nickname_detection', name)
  end
end

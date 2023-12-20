class Dataset < ApplicationRecord
  enum :visibility, { dataset_public: 'public', dataset_private: 'private' }, default: :dataset_private

  belongs_to :owner, polymorphic: true
  belongs_to :creator, class_name: 'User', foreign_key: :creator_id

  after_create :sync_created_dataset_to_starhub_server
  after_destroy :delete_dataset_from_starhub_server

  validates :name, format: { with: /\A(?=.{2,20}$)(?!.*[_]{2})(?!.*[-]{2})[a-zA-Z0-9_-]+\Z/ }

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

  def sync_created_dataset_to_starhub_server
    res = Starhub.api.create_dataset(creator.name, name, owner.name, { license: license, private: dataset_private?  })
    raise StarhubError, res.body unless res.success?
  end

  def delete_dataset_from_starhub_server
    res = Starhub.api.delete_dataset(owner.name, name)
    raise StarhubError, res.body unless res.success?
  end
end

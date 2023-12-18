class Dataset < ApplicationRecord
  enum :visibility, { dataset_public: 'public', dataset_private: 'private' }, default: :dataset_private

  belongs_to :owner, polymorphic: true
  belongs_to :creator, class_name: 'User', foreign_key: :creator_id

  after_create :sync_created_dataset_to_starhub_server

  validates :name, format: { with: /\A(?=.{2,20}$)(?!.*[_]{2})(?!.*[-]{2})[a-zA-Z0-9_-]+\Z/ }

  def path
    "#{owner.name}/#{name}"
  end

  private

  def sync_created_dataset_to_starhub_server
    res = Starhub.api.create_dataset(creator.name, name, owner.name, { license: license })
    raise ActiveRecord::Rollback unless res.success?
  end
end

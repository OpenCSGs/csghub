class Dataset < ApplicationRecord
  enum :visibility, { dataset_public: 'public', dataset_private: 'private' }, default: :dataset_private

  belongs_to :owner, polymorphic: true
  belongs_to :creator, class_name: 'User', foreign_key: :creator_id

  validates :name, format: { with: /\A(?=.{2,20}$)(?!.*[_]{2})(?!.*[-]{2})[a-zA-Z0-9_-]+\Z/ }

  def path
    "#{owner.name}/#{name}"
  end
end

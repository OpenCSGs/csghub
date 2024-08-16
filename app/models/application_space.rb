class ApplicationSpace < ApplicationRecord
  enum :visibility, { application_space_public: 'public', application_space_private: 'private' }, default: :space_private

  belongs_to :owner, polymorphic: true
  belongs_to :creator, class_name: 'User', foreign_key: :creator_id
  has_many :discussions, as: :discussionable, dependent: :destroy

  def path
    "#{owner.name}/#{name}"
  end
end

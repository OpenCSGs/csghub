class ApplicationSpace < ApplicationRecord
  enum :visibility, { space_public: 'public', space_private: 'private' }, default: :space_private

  belongs_to :owner, polymorphic: true
  belongs_to :creator, class_name: 'User', foreign_key: :creator_id
  has_many :discussions, as: :discussionable, dependent: :destroy

  after_create :sync_created_space_to_starhub_server
  before_save :detect_sensitive_content

  validates :name, format: { with: /\A(?=.{2,70}$)(?!.*[_]{2})(?!.*[-]{2})(?!.*[.]{2})[a-zA-Z0-9_.-]+\Z/ }

  validates :name, uniqueness: { scope: [:owner_type, :owner_id], case_sensitive: false }

  def path
    "#{owner.name}/#{name}"
  end

  private

  def sync_created_space_to_starhub_server
    res = Starhub.api.create_application_space(creator.name, name, owner.name, nickname, desc,
                                               { license: license,
                                                 private: space_private?,
                                                 cover_image_url: cover_image,
                                                 hardware: cloud_resource,
                                                 sdk: sdk
                                               })
    raise StarhubError, res.body unless res.success?
  end

  def detect_sensitive_content
    Starhub.api.text_secure_check('nickname_detection', name)
  end
end

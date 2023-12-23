class Organization < ApplicationRecord
  enum :org_type, {'企业': 'company', '高校': 'university', '非营利组织': 'non_profit', '社区组织': 'community'}

  validates_uniqueness_of :name
  validates :name, format: { with: /\A(?=.{2,20}$)(?!.*[_]{2})(?!.*[-]{2})[a-zA-Z0-9_-]+\Z/ }

  validate :unique_name_by_user

  has_many :org_memberships, dependent: :destroy
  has_many :users, through: :org_memberships
  has_many :models, as: :owner
  has_many :datasets, as: :owner
  belongs_to :creator, class_name: 'User', foreign_key: :creator_id

  after_create :sync_to_starhub_server
  before_save :detect_sensitive_content

  def avatar_url
    if logo
      # retrive the image temp url from aliyun
      AliyunOss.instance.download logo
    else
      asset_host = ENV.fetch('ASSET_HOST', 'http://localhost:3000')
      "#{asset_host}/assets/default_org.png"
    end
  end

  def as_json options={}
    {
      avatar: avatar_url,
      name: name,
      nickname: nickname,
      org_type: org_type,
      homepage: homepage
    }
  end

  def starhub_synced!
    # do not trigger the callback again
    self.update_column('starhub_synced', true)
  end

  def starhub_synced?
    starhub_synced == true
  end

  private

  def detect_sensitive_content
    Starhub.api.text_secure_check('nickname_detection', "#{name} #{nickname} #{homepage}")
    Starhub.api.image_secure_check('profilePhotoCheck', bucket_name, logo)
  end

  def sync_to_starhub_server
    res = Starhub.api.create_organization(creator.name, name, nickname, homepage)
    raise StarhubError, res.body unless res.success?
    starhub_synced!
  end

  def unique_name_by_user
    errors.add(:name, 'is already taken') if User.where(name: name).exists?
  end

  def bucket_name
    if Rails.env.production?
      Rails.application.credentials.aliyun_oss.production.bucket_name
    else
      Rails.application.credentials.aliyun_oss.staging.bucket_name
    end
  end
end

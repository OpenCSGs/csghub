class Organization < ApplicationRecord
  enum :org_type, {'企业': 'company', '高校': 'university', '非营利组织': 'non_profit', '社区组织': 'community'}

  validates_presence_of :name, :org_type
  validates_uniqueness_of :name
  validates_length_of :nickname, maximum: 20
  validates_length_of :homepage, maximum: 100
  validates :name, format: { with: NAME_RULE }

  validate :unique_name_by_user

  has_many :org_memberships, dependent: :destroy
  has_many :users, through: :org_memberships
  has_many :models, as: :owner
  has_many :datasets, as: :owner
  has_many :application_spaces, as: :owner
  has_many :codes, as: :owner
  belongs_to :creator, class_name: 'User', foreign_key: :creator_id

  has_many :admin_users, -> { distinct.joins(:org_memberships).where({ org_memberships: {role: :admin} }) }, class_name: 'User', through: :org_memberships, source: :user

  # after_save :sync_to_starhub_server
  before_save :detect_sensitive_content

  def avatar_url
    if logo
      # retrive the image temp url from aliyun
      AwsS3.instance.download logo
    else
      "/images/default_org.png"
    end
  end

  def members
    users.map {|user|
      user.as_json.merge(role: user.org_role(self))
    }
  end

  def as_json options={}
    {
      avatar: avatar_url,
      logo: logo,
      name: name,
      nickname: nickname,
      org_type: org_type,
      homepage: homepage,
      verified: verified,
      creator_id: creator_id,
    }
  end

  def starhub_synced!
    # do not trigger the callback again
    self.update_column('starhub_synced', true)
  end

  def starhub_synced?
    starhub_synced == true
  end

  def is_last_admin?(user)
    return false if user.org_role(self) != 'admin'

    admin_users.count <= 1
  end

  private

  def detect_sensitive_content
    Starhub.api(creator.session_ip).text_secure_check('nickname_detection', "#{name} #{nickname} #{homepage}")
    Starhub.api(creator.session_ip).image_secure_check('profilePhotoCheck', bucket_name, logo)
  end

  def sync_to_starhub_server
    if starhub_synced?
      res = Starhub.api(creator.session_ip).update_organization(creator.name, name, nickname, homepage, creator.name)
      raise StarhubError, res.body unless res.success?
    else
      res = Starhub.api(creator.session_ip).create_organization(creator.name, name, nickname, homepage, creator.name)
      raise StarhubError, res.body unless res.success?
      starhub_synced!
    end
  end

  def unique_name_by_user
    errors.add(:name, 'is already taken') if User.where(name: name).exists?
  end

  def bucket_name
    if Rails.env.production?
      Rails.application.credentials.s3.production.bucket_name
    else
      Rails.application.credentials.s3.staging.bucket_name
    end
  end
end

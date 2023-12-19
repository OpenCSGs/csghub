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

  def avatar_url
    if logo
      # retrive the image temp url from aliyun
      AliyunOss.instance.download logo
    else
      nil
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
    self.starhub_synced = true
    self.save
  end

  def starhub_synced?
    starhub_synced == true
  end

  private

  def sync_to_starhub_server
    res = Starhub.api.create_organization(creator.name, name, nickname, homepage)
    raise StarhubError, JSON.parse(res.body)['message'] unless res.success?
    starhub_synced!
  end

  def unique_name_by_user
    errors.add(:name, 'is already taken') if User.where(name: name).exists?
  end
end

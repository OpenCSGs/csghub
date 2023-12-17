class Organization < ApplicationRecord
  enum :org_type, {'企业': 'company', '高校': 'university', '非营利组织': 'non_profit', '社区组织': 'community'}

  validates_uniqueness_of :name
  validates :name, format: { with: /\A(?=.{2,20}$)(?![_])(?!.*[_]{2})[a-zA-Z0-9_]+(?<![_])\Z/ }

  validate :unique_name_by_user

  has_many :org_memberships, dependent: :destroy
  has_many :users, through: :org_memberships
  has_many :models, as: :owner
  has_many :datasets, as: :owner

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

  private

  def unique_name_by_user
    errors.add(:name, 'is already taken') if User.where(name: name).exists?
  end
end

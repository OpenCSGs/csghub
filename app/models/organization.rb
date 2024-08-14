class Organization < ApplicationRecord
  has_many :org_memberships, dependent: :destroy
  has_many :users, through: :org_memberships
  has_many :models, as: :owner
  has_many :datasets, as: :owner
  has_many :application_spaces, as: :owner
  has_many :codes, as: :owner
  belongs_to :creator, class_name: 'User', foreign_key: :creator_id

  has_many :admin_users, -> { distinct.joins(:org_memberships).where({ org_memberships: {role: :admin} }) }, class_name: 'User', through: :org_memberships, source: :user

  def avatar_url
    if logo
      # retrive the image temp url from aliyun
      AwsS3.instance.download logo
    else
      "/images/default_org.png"
    end
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
end

class Organization < ApplicationRecord
  enum :org_type, {'企业': 'company', '高校': 'university', '非营利组织': 'non_profit', '社区组织': 'community'}

  has_many :org_memberships, dependent: :destroy
  has_many :users, through: :org_memberships

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
end

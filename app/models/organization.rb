class Organization < ApplicationRecord
  enum :org_type, {'企业': 'company', '高校': 'university', '非营利组织': 'non_profit', '社区组织': 'community'}

  has_many :org_memberships, dependent: :destroy
  has_many :users, through: :org_memberships
end

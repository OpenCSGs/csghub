class OrgMembership < ApplicationRecord
  belongs_to :organization
  belongs_to :user
end

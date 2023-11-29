class OrgMembership < ApplicationRecord
  belongs_to :organization
  belongs_to :user

  enum :role, [:read, :write, :admin]
end

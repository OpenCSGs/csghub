class Tag < ApplicationRecord
  has_many :taggings, dependent: :destroy
  has_many :spaces, through: :taggings
end

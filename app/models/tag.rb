class Tag < ApplicationRecord
  has_many :taggings, dependent: :destroy
  has_many :spaces, through: :taggings

  def as_json options = nil
    {
      name: name,
      color: color
    }
  end
end

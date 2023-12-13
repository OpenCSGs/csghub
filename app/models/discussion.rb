class Discussion < ApplicationRecord
  has_many :comments, as: :commentable
end

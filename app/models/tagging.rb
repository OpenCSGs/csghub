class Tagging < ApplicationRecord
  belongs_to :tag
  belongs_to :space, optional: true
end

class EmailGroup < ApplicationRecord
  validates :name, :email_list, presence: true
  validates_uniqueness_of :name
end

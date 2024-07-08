class EmailGroup < ApplicationRecord
  validates :name, :email_list, presence: true
end

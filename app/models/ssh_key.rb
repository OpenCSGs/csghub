class SshKey < ApplicationRecord
  belongs_to :user

  validates_presence_of :name, :ssh_key
  validates_uniqueness_of :name, :ssh_key
end

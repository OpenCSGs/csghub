class SshKey < ApplicationRecord
  belongs_to :user

  # after_create :sync_to_starhub_server
  # after_destroy :delete_from_starhub_server

  validates_presence_of :name, :ssh_key
  validates_uniqueness_of :name, :ssh_key, scope: :user_id
end

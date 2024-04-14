class SshKey < ApplicationRecord
  belongs_to :user

  after_create :sync_to_starhub_server
  after_destroy :delete_from_starhub_server

  validates_presence_of :name, :ssh_key
  validates_uniqueness_of :name, :ssh_key, scope: :user_id

  def starhub_synced!
    # do not trigger the callback again
    self.update_column('starhub_synced', true)
  end

  def starhub_synced?
    starhub_synced == true
  end

  def sync_to_starhub_server
    res = Starhub.api(user.session_ip).create_ssh_key(user.name, name, ssh_key)
    raise StarhubError, res.body unless res.success?
    starhub_synced!
  end

  def delete_from_starhub_server
    res = Starhub.api(user.session_ip).delete_ssh_key(user.name, name)
    raise StarhubError, res.body unless res.success?
  end
end

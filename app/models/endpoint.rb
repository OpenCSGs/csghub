class Endpoint < ApplicationRecord
  enum :visibility, { endpoint_public: 'public', endpoint_private: 'private' }, default: :endpoint_private

  belongs_to :owner, polymorphic: true
  belongs_to :creator, class_name: 'User', foreign_key: :creator_id

  before_save :detect_sensitive_content
  after_create :sync_created_endpoint_to_starhub_server
  after_update :sync_updated_endpoint_to_starhub_server
  after_destroy :delete_endpoint_from_starhub_server

  validates :name, format: { with: NAME_RULE }

  validates :name, uniqueness: { scope: [:owner_type, :owner_id], case_sensitive: false }

  private

  def sync_created_endpoint_to_starhub_server
    res = Starhub.api(creator.session_ip).create_endpoint(self)
    raise StarhubError, res.body unless res.success?
    self.update_column('endpoint_id', JSON.parse(res.body)['data']['deploy_id'])
  end

  def sync_updated_endpoint_to_starhub_server
    res = Starhub.api(creator.session_ip).update_endpoint(self)
    raise StarhubError, res.body unless res.success?
  end

  def delete_endpoint_from_starhub_server
    res = Starhub.api(creator.session_ip).delete_endpoint(self)
    raise StarhubError, res.body unless res.success?
  end

  def detect_sensitive_content
    Starhub.api(creator.session_ip).text_secure_check('nickname_detection', name)
  end
end

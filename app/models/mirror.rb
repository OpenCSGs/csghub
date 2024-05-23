class Mirror < ApplicationRecord
  belongs_to :owner, polymorphic: true
  belongs_to :creator, class_name: 'User', foreign_key: :creator_id
  belongs_to :model
  belongs_to :dataset
  belongs_to :code
  belongs_to :space

  after_create :sync_created_mirror_to_starhub_server

  validates :name, format: { with: NAME_RULE }

  validates :name, uniqueness: { scope: [:owner_type, :owner_id], case_sensitive: false }

  def path
    "#{owner.name}/#{name}"
  end

  private

  def sync_created_model_to_starhub_server
    res = Starhub.api(creator.session_ip).create_model(creator.name,
                                                       name,
                                                       owner.name,
                                                       nickname,
                                                       desc,
                                                       { license: license,
                                                         private: model_private? })
    raise StarhubError, res.body unless res.success?
  end
end

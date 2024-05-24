class Mirror < ApplicationRecord
  belongs_to :user
  belongs_to :mirrorable, polymorphic: true

  validates_presence_of :source_url, :mirror_source_id, :username, :access_token, :mirrorable_type, :mirrorable_id

  enum :mirrorable_type, Model: 'Model', Dataset: 'Dataset', Code: 'Code', Space: 'Space'


  # scope :without_lead_form, -> { includes(:mirror).where(mirrors: { id: nil }) }

  # after_create :sync_created_mirror_to_starhub_server
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

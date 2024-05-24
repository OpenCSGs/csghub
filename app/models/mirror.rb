class Mirror < ApplicationRecord
  belongs_to :user
  belongs_to :mirrorable, polymorphic: true

  validates_presence_of :source_url, :mirror_source_id, :mirrorable_type, :mirrorable_id

  enum :mirrorable_type, Model: 'Model', Dataset: 'Dataset', Code: 'Code', Space: 'Space'


  # scope :without_lead_form, -> { includes(:mirror).where(mirrors: { id: nil }) }

  # after_create :sync_created_mirror_to_starhub_server
  def path
    "#{owner.name}/#{name}"
  end

  private

  def sync_created_mirror_to_starhub_server
    res = Starhub.api.create_mirror(mirrorable_type.downcase,
                                    user.name,
                                    mirrorable.name,
                                    { source_url: source_url,
                                    mirror_source_id: mirror_source_id,
                                    push_access_token: access_token,
                                    push_username: user.name })

    raise StarhubError, res.body unless res.success?
  end
end

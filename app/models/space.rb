class Space < ApplicationRecord
  validates_presence_of :space_starchain_id,
                        :title,
                        :desc,
                        :site_link,
                        :space_type

  validates_uniqueness_of :space_starchain_id

  enum status: [:running,
                :stopped]

  belongs_to :user, dependent: :destroy
end

class Space < ApplicationRecord
  validates_presence_of :space_starchain_id,
                        :title,
                        :desc,
                        :site_link,
                        :space_type, message: "缺少必填字段"

  belongs_to :user, dependent: :destroy
end

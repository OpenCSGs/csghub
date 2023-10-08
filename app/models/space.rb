class Space < ApplicationRecord
  validates_presence_of :space_starchain_id,
                        :title,
                        :desc,
                        :site_link,
                        :space_type

  validates_uniqueness_of :space_starchain_id

  enum status: [:running,
                :stopped], _default: "running"

  enum space_type: [:private_s,
                    :public_s], _default: "private_s"

  belongs_to :user, dependent: :destroy
  has_many :taggings, dependent: :destroy
  has_many :tags, through: :taggings

  def cover_image_url
    if cover_image
      # retrive the image temp url from aliyun
      AliyunOss.instance.download cover_image
    else
      nil
    end
  end

  def author
    user.name
  end

  def readable_type
    case space_type
    when 'private_s'
      'private'
    when 'public_s'
      'public'
    end
  end
end

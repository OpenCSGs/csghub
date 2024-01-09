class Space < ApplicationRecord
  paginates_per 6

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

  belongs_to :user
  has_many :taggings, dependent: :destroy
  has_many :tags, through: :taggings
  has_many :comments, as: :commentable

  before_save :detect_sensitive_content

  def cover_image_url
    if cover_image
      # retrive the image temp url from aliyun
      AwsS3.instance.download cover_image
    else
      nil
    end
  end

  def author
    user.name || user.phone || user.login_identity
  end

  def readable_type
    case space_type
    when 'private_s'
      'private'
    when 'public_s'
      'public'
    end
  end

  def application_url
    if running?
      site_link
    else
      "/spaces/stopped"
    end
  end

  def as_json options = nil
    {
      title: title,
      desc: desc,
      author: author,
      created_at: created_at.strftime('%Y-%m-%d %H:%M:%S'),
      cover_image: cover_image_url || ActionController::Base.helpers.asset_path('default_cover_image.png'),
      tags: tags.to_json,
      status: status,
      star_chain_id: space_starchain_id,
      space_type: readable_type,
      author_uuid: user.login_identity
    }
  end

  private

  def detect_sensitive_content
    text_content = "#{title} #{desc} #{tags.map(&:name)}"
    Starhub.api.text_secure_check('nickname_detection', text_content)
    Starhub.api.image_secure_check('baselineCheck', bucket_name, cover_image) if cover_image.present?
  end

  def bucket_name
    if Rails.env.production?
      Rails.application.credentials.s3.production.bucket_name
    else
      Rails.application.credentials.s3.staging.bucket_name
    end
  end
end

class DailyPaper < ApplicationRecord
  include UuidConcern

  validates_presence_of :title, :article_link, :cover_url, :published_at, :pdf_link, :recommendation, :description
  validates_uniqueness_of :article_link

  belongs_to :recommender, class_name: 'User', foreign_key: :user_id
  delegate :name, :avatar_url, to: :recommender, prefix: true, allow_nil: true

  has_many :comments, as: :commentable, dependent: :destroy

  scope :search_by, ->(keywords) { 
    keywords.present? ? 
      where('title ILIKE :keywords OR article_link ILIKE :keywords OR description ILIKE :keywords OR recommendation ILIKE :keywords', keywords: "%#{keywords}%") : self
  }

  def as_json options={}
    {
      id:id,
      uuid: uuid,
      title: title,
      published_at: published_at,
      recommendation: recommendation,
      cover_url: cover_url,
      comments:comments.as_json,
      recommender_name: recommender_name,
      recommender_avatar_url: recommender_avatar_url,
      article_link: article_link,
      pdf_link: pdf_link,
      description: description,
      video_link: video_link,
      model_links: model_links,
      dataset_links: dataset_links,
      created_at: created_at,
      updated_at: updated_at
    }
  end
end

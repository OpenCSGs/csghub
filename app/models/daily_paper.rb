class DailyPaper < ApplicationRecord
  include UuidConcern

  validates_presence_of :title, :article_link, :cover_url, :published_at, :pdf_link, :recommendation, :description
  validates_uniqueness_of :article_link

  belongs_to :recommender, class_name: 'User', foreign_key: :user_id
  delegate :name, :avatar_url, to: :recommender, prefix: true, allow_nil: true

  scope :search_by, ->(keywords) { 
    keywords.present? ? 
      where('title ILIKE :keywords OR article_link ILIKE :keywords OR description ILIKE :keywords OR recommendation ILIKE :keywords', keywords: "%#{keywords}%") : self
  }

  def as_json options={}
    {
      uuid: uuid,
      title: title,
      published_at: published_at,
      recommendation: recommendation,
      cover_url: cover_url,
      recommender_name: recommender_name,
      recommender_avatar_url: recommender_avatar_url
    }
  end
end

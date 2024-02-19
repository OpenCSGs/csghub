class DailyPaper < ApplicationRecord
  include UuidConcern

  validates_presence_of :title, :article_link, :cover_url, :published_at, :pdf_link, :recommendation, :description
  validates_uniqueness_of :article_link

  belongs_to :recommender, class_name: 'User', foreign_key: :user_id
end

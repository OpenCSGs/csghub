class Comment < ApplicationRecord
  include ActionView::Helpers::DateHelper

  belongs_to :commentable, polymorphic: true
  belongs_to :user

  validates :content, presence: true

  before_save :detect_sensitive_content

  def as_json options={}
    {
      id: id,
      content: content,
      time: time_ago_in_words(created_at),
      user: user_json
    }
  end

  private

  def user_json
    {
      id: user.id,
      name: user.display_name,
      avatar: user.avatar_url
    }
  end

  def detect_sensitive_content
    Starhub.api.text_secure_check('comment_detection', content)
  end
end

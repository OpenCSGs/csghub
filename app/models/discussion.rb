class Discussion < ApplicationRecord
  include ActionView::Helpers::DateHelper

  has_many :comments, as: :commentable, dependent: :destroy
  belongs_to :user
  belongs_to :discussionable, polymorphic: true

  before_save :detect_sensitive_content

  def as_json options={}
    {
      id: id,
      title: title,
      time: time_ago_in_words(created_at),
      user: user_json
    }
  end

  private

  def user_json
    {
      id: user.id,
      name: user.display_name,
      avatar: user.avatar
    }
  end

  def detect_sensitive_content
    Starhub.api.text_secure_check('nickname_detection', title)
  end
end

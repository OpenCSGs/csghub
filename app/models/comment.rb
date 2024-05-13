class Comment < ApplicationRecord
  include ActionView::Helpers::DateHelper

  belongs_to :commentable, polymorphic: true
  belongs_to :user

  validates :content, presence: true

  before_save :detect_sensitive_content
  after_save :send_email_to_users_in_comments

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
    Starhub.api(user.session_ip).text_secure_check('comment_detection', content)
  end

  def send_email_to_users_in_comments
    usernames = content.scan(/`@(\w+)`/).flatten.uniq
    users = User.where(name: usernames)
    users.each do |user|
      next if user&.email.blank?
      SystemNotificationMailer.with(comment_id: id, user_email: user.email).delay.new_comment_alert
    end
  rescue
    Rails.logger.error("======== Error ========: Send user comments alert failed")
  end
end

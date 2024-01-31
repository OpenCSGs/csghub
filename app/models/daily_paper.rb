class DailyPaper < ApplicationRecord
  include UuidConcern

  belongs_to :recommender, class_name: 'User', foreign_key: :user_id
end

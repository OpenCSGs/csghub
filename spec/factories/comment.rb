FactoryBot.define do
  factory :comment do
    content { 'Test comment' }
    created_at { '2023-01-15 10:30:00' }

    user
    association :commentable, factory: :space
  end
end


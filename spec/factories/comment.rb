FactoryBot.define do
  factory :comment do
    content { 'Test comment' }

    user
    # Associate the commentable attribute to a Space object
    association :commentable, factory: :space
  end
end


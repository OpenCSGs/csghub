FactoryBot.define do
  factory :user do
    login_identity { SecureRandom.base58(12) }
    name { 'Joe' }
    phone { '17708176699' }
    avatar { 'avatar/HvbRkkwo' }
  end
end
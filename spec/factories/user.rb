FactoryBot.define do
  factory :user do
    login_identity { 'uuid123401' }
    name { 'Joe' }
    phone { '17708176699' }

  end
end
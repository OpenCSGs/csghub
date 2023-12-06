FactoryBot.define do
  factory :system_api_key do
    service { "MyString" }
    secret_key { "MyString" }
  end
end

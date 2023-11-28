FactoryBot.define do
  factory :ssh_key do
    user { nil }
    name { "MyString" }
    ssh_key { "MyText" }
  end
end

FactoryBot.define do
  factory :landing_page do
    lead_source { "MyString" }
    channel { "MyString" }
    lead_status { "MyString" }
    local_channel { "MyString" }
    lead_type { "MyString" }
    lead_fields { "MyString" }
    uuid { "MyString" }
    landing_page_status { "MyString" }
    title { "MyString" }
    internal_title { "MyString" }
    description { "MyText" }
    custom_required_fields { "MyString" }
  end
end

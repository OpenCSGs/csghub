FactoryBot.define do
  factory :lead_form do
    title { "test_lead_form" }
    lead_fields { ["phone", "title", "name", "email", "company"] }
    custom_required_fields { ["title", "", "", "", "", "", ""] }
  end
end
  
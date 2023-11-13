FactoryBot.define do
  factory :campaign do
    name { "MyString" }
    location { "MyString" }
    organizer { "MyString" }
    campaign_type { 1 }
    content { "MyText" }
    start_date { "2023-11-18 15:17:35" }
    end_date { "2023-11-19 15:17:35" }

    after(:build) do |campaign|
      campaign.desktop_banner.attach(
        io: File.open(Rails.root.join('app', 'assets', 'images', 'opencsg_logo.png')),
        filename: 'desktop_banner.png',
      )
      campaign.mobile_banner.attach(
        io: File.open(Rails.root.join('app', 'assets', 'images', 'opencsg_logo.png')),
        filename: 'mobile_banner.png',
      )
    end
  end
end

FactoryBot.define do
  factory :space do
    space_starchain_id { 'abc1234' }
    title  { 'Space Title' }
    desc { 'This is desc for space' }
    site_link { 'http://test.com' }
    space_type { 'private_s' }

    user
  end
end
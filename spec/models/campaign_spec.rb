require 'rails_helper'

RSpec.describe Campaign, type: :model do
  subject(:campaign) { build(:campaign) }

  describe 'associations' do
    it { should have_rich_text(:content) }
  end

  describe 'before_create callback' do
    it 'sets a UUID before creating a campaign' do
      campaign.save
      expect(campaign.uuid).not_to be_nil
      expect(campaign.uuid.length).to eq(12)
    end
  end
end

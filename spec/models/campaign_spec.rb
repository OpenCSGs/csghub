require 'rails_helper'

include Rails.application.routes.url_helpers

RSpec.describe Campaign, type: :model do
  subject(:campaign) { build(:campaign) }

  describe 'associations' do
    it { should have_rich_text(:content) }
    it { should have_one_attached(:desktop_banner) }
    it { should have_one_attached(:mobile_banner) }
    it { should have_one(:lead_form) }
    it { should have_many(:leads).through(:lead_form) }
  end

  describe 'enums' do
    it { should define_enum_for(:campaign_type).with_values(live_competition: 0, training_camp: 1, offline_campaign: 2) }
    it { should define_enum_for(:status).with_values(prestart: 0, signing_up: 1, in_progress: 2, ended: 3) }
  end

  describe 'scopes' do
    describe '.without_lead_form' do
      it 'returns campaigns without a lead form' do
        campaign_without_lead_form = create(:campaign)
        expect(Campaign.without_lead_form).to include(campaign_without_lead_form)
      end

      it 'does not return campaigns with a lead form' do
        lead_form = create(:lead_form, campaign: create(:campaign))
        expect(Campaign.without_lead_form).not_to include(lead_form.campaign)
      end
    end

    describe '.recommended' do
      it 'returns recommended campaigns' do
        recommended_campaign = create(:campaign, recommended: true)
        create(:campaign, recommended: false)
        expect(Campaign.recommended).to include(recommended_campaign)
      end

      it 'does not return non-recommended campaigns' do
        create(:campaign, recommended: false)
        expect(Campaign.recommended).to be_empty
      end
    end
  end

  describe 'callbacks' do
    describe 'before_create' do
      it 'sets a UUID before creating a campaign' do
        campaign.save
        expect(campaign.uuid.length).to eq(12)
      end
    end
  end

  describe '#with_content_and_leads_count' do
    it 'returns a hash with content, leads_count, start_date, and end_date' do
      campaign = create(:campaign)
      create_list(:lead, 3, lead_form: campaign.lead_form)
      expect(campaign.with_content_and_leads_count).to include(
        content: campaign.content.body.to_plain_text.squish,
        leads_count: campaign.leads.count,
        start_date: campaign.start_date.to_date,
        end_date: campaign.end_date.to_date
      )
    end
  end

  describe '#with_blob_path' do
    it 'returns the URL of the attached blob if it exists' do
      campaign = create(:campaign)
      expect(campaign.with_blob_path(campaign.desktop_banner)).to eq(rails_blob_path(campaign.desktop_banner, disposition: "inline", only_path: true))
    end
  end

  describe '#banner_attributes' do
    it 'returns a hash with uuid, desktop_banner_url, and mobile_banner_url' do
      campaign = create(:campaign)
      expect(campaign.banner_attributes).to include(
        'uuid' => campaign.uuid,
        :desktop_banner_url => campaign.with_blob_path(campaign.desktop_banner),
        :mobile_banner_url => campaign.with_blob_path(campaign.mobile_banner)
      )
    end
  end
end

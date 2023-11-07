require 'rails_helper'

RSpec.describe LeadForm, type: :model do
  let(:campaign) { create(:campaign) }
  let(:lead_form) { create(:lead_form, campaign: campaign) }
  
  describe 'associations' do
    it { should belong_to(:campaign) }
    it { should have_many(:leads).with_primary_key(:uuid).with_foreign_key(:lead_form_uuid) }
  end
  
  describe '#form_url' do
    it 'returns the correct form URL' do
      expect(lead_form.form_url).to eq("#{LEAD_FORM_HOST}/lead_forms/form/#{lead_form.uuid}_#{lead_form.title.gsub(/\s+/, '_')}")
    end
  end
  
  describe '#toggle_lead_form_status!' do
    it 'toggles the lead form status' do
      expect { lead_form.toggle_lead_form_status! }.to change { lead_form.lead_form_status }.from('active').to('inactive')
      expect { lead_form.toggle_lead_form_status! }.to change { lead_form.lead_form_status }.from('inactive').to('active')
    end
  end
  
  describe '#available_form_fields' do
    it 'returns an array of available form fields' do
      expect(LeadForm.available_form_fields).to eq([
        'name',
        'phone',
        'company',
        'email',
        'title',
        'industry',
        'province',
        'email_opt_out',
        'num_of_employees',
        'additional_notes'
      ])
    end
  end
  
  describe '#required_form_fields' do
    it 'returns an array of required form fields' do
      expect(LeadForm.required_form_fields).to eq([
        'name',
        'phone',
        'company'
      ])
    end
  end
  
  describe '#set_default_status' do
    it 'sets the default status to "lead_form"' do
      expect(lead_form.local_channel).to eq('lead_form')
    end
  end
  
  describe 'before_create' do
    it 'sets the default status before creating a new lead form' do
      lead_form = build(:lead_form, campaign: campaign)
      expect(lead_form.local_channel).to be_nil
      lead_form.save
      expect(lead_form.local_channel).to eq('lead_form')
    end
  end
end

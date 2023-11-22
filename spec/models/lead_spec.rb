require 'rails_helper'

RSpec.describe Lead, type: :model do
  subject(:lead) { build(:lead) }

  describe 'validations' do
    it { should validate_presence_of(:company) }
    it { should validate_presence_of(:phone) }
    it { should validate_presence_of(:name) }

    context 'when lead_form is present' do
      let(:lead_form) { create(:lead_form) }
      let(:lead) { build(:lead, lead_form: lead_form, title: nil) }

      it 'validates presence of custom required fields' do
        lead.valid?
        expect(lead.errors[:title]).to include('请填写完整表单')
      end
    end
  end

  describe 'associations' do
    it { should belong_to(:lead_form).optional }
  end
end

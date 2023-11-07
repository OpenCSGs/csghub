require 'rails_helper'

RSpec.describe Tag, type: :model do
  subject(:tag) { build(:tag) }

  describe 'associations' do
    it { should have_many(:taggings).dependent(:destroy) }
    it { should have_many(:spaces).through(:taggings) }
  end

  describe 'DEFAULT_TAGS' do
    it 'contains the expected default tags' do
      expected_tags = [
        { name: '语言模型', color: '#009933' },
        { name: '图片模型', color: '#ff9900' },
        { name: '多模态', color: '#cc0066' },
        { name: '智能体', color: '#cc33ff' }
      ]

      expect(Tag::DEFAULT_TAGS).to match_array(expected_tags)
    end
  end

  describe 'as_json' do
    it 'returns a JSON representation of the tag' do
      expected_json = { name: 'tag', color: '#ff0000' }
      expect(tag.as_json).to eq(expected_json)
    end
  end
end

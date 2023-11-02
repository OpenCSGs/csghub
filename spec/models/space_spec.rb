require 'rails_helper'

RSpec.describe Space, type: :model do
  subject(:space) { build(:space) }
  # refer to: https://github.com/thoughtbot/shoulda-matchers/blob/main/lib/shoulda/matchers/active_record/association_matcher.rb#L328
  describe 'associations' do
    it { should belong_to(:user) }
    it { should have_many(:taggings).dependent(:destroy) }
    it { should have_many(:tags).through(:taggings) }
    it { should have_many(:comments) }
  end

  # refer to: https://github.com/thoughtbot/shoulda-matchers/tree/main
  describe 'validations' do
    it { should validate_presence_of(:space_starchain_id) }
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:desc) }
    it { should validate_presence_of(:site_link) }
    it { should validate_presence_of(:space_type) }
  end

  describe 'enum definitions' do
    it { should define_enum_for(:status).with_values([:running, :stopped]) }
    it { should define_enum_for(:space_type).with_values([:private_s, :public_s]) }
  end

  describe '#cover_image_url' do
    let(:image_url) { 'http://aliyun.oss.test' }
    context 'when cover_image present' do
      before do
        allow(AliyunOss.instance).to receive(:download).and_return image_url
      end
      it 'returns correct aliyun oss url' do
        space.cover_image = 'asfafa'
        expect(space.cover_image_url).to eq image_url
      end
    end
    context 'when cover_image present' do
      it 'returns nil' do
        expect(space.cover_image_url).to be_nil
      end
    end
  end

  describe '#author' do
    context 'when name is present' do
      it 'returns space user name' do
        expect(space.author).to eq space.user.name
      end
    end
    context 'when name is nil, phone is present' do
      it 'returns space user name' do
        space.user.name = nil
        expect(space.author).to eq space.user.phone
      end
    end
    context 'when name is nil, phone is nil, login identity is present' do
      it 'returns space user login identity' do
        space.user.name = nil
        space.user.phone = nil
        expect(space.author).to eq space.user.login_identity
      end
    end
  end

  describe '#readable_type' do
    context 'when space_type is private_s' do
      it 'returns "private"' do
        space.space_type = 'private_s'
        expect(space.readable_type).to eq('private')
      end
    end

    context 'when space_type is public_s' do
      it 'returns "public"' do
        space.space_type = 'public_s'
        expect(space.readable_type).to eq('public')
      end
    end
  end

  describe '#application_url' do
    let(:site_link) { 'http://test.com' }
    context 'when running' do
      before do
        allow(space).to receive(:running?).and_return(true)
        allow(space).to receive(:site_link).and_return(site_link)
      end

      it 'returns the site link' do
        expect(space.application_url).to eq(site_link)
      end
    end

    context 'when not running' do
      before do
        allow(space).to receive(:running?).and_return(false)
      end

      it 'returns "/spaces/stopped"' do
        expect(space.application_url).to eq('/spaces/stopped')
      end
    end
  end

  describe '#as_json' do
    let(:space_json) { space.as_json }

    it 'returns a valid JSON object' do
      expect(space_json).to be_a(Hash)
    end

    it 'includes the expected attributes and values' do
      allow(ActionController::Base.helpers).to receive(:asset_path).and_return('/assets/default_cover_image.png')

      expect(space_json).to include(
                        title: 'Space Title',
                        desc: 'This is desc for space',
                        author: 'Joe',
                        created_at: '2023-01-15 10:30:00',
                        cover_image: ActionController::Base.helpers.asset_path('default_cover_image.png'),
                        tags: '[]',
                        status: 'running',
                        star_chain_id: 'abc1234',
                        space_type: 'private',
                        author_uuid: 'uuid123401'
                      )
    end
  end
end


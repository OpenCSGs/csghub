require 'rails_helper'
include ActionView::Helpers::DateHelper

RSpec.describe Comment, type: :model do
  subject(:comment) { create(:comment) }

  describe 'associations' do
    it { should belong_to(:commentable) }
    it { should belong_to(:user) }
  end

  describe 'validations' do
    it { should validate_presence_of(:content) }
  end

  describe 'as_json' do
    let(:comment) { create(:comment) }

    it 'returns a JSON representation of the comment' do
      user = comment.user
      expected_json = {
        id: comment.id,
        content: comment.content,
        time: time_ago_in_words(comment.created_at),
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar_url
        }
      }

      expect(comment.as_json).to eq(expected_json)
    end
  end
end

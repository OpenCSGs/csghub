require 'rails_helper'

RSpec.describe Comment, type: :model do
  subject(:comment) { build(:comment) }

  describe 'associations' do
    it { should belong_to(:commentable) }
    it { should belong_to(:user) }
  end

  describe 'validations' do
    it { should validate_presence_of(:content) }
  end

  # describe 'as_json_data' do
  #   it 'returns a JSON representation of the comment' do
  #     expected_json = {
  #       id: comment.id,
  #       content: 'Test comment',
  #       time: '2023-01-15 10:30:00',
  #       user: {
  #         id: '1',
  #         name: 'Joe',
  #         avatar: 'avatar/HvbRkkwo'
  #       }
  #     }
  #
  #     expect(comment.as_json_data).to eq(expected_json)
  #   end
  # end

  # RSpec.describe Comment do
  #   describe '#user_json' do
  #     it 'returns the expected JSON data' do
  #       user = create(:user, comment_display_name: 'Joe', avatar: 'avatar/HvbRkkwo') # 使用FactoryBot或其他方式创建一个用户对象
  #       comment = create(:comment, user: user)
  #
  #       user_json = comment.user_json
  #
  #       expect(user_json).to be_a(Hash)
  #       expect(user_json[:id]).to eq(user.id)
  #       expect(user_json[:name]).to eq(user.comment_display_name)
  #       expect(user_json[:avatar]).to eq(user.avatar)
  #     end
  #   end
  # end
end

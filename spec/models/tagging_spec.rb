require 'rails_helper'

RSpec.describe Tagging, type: :model do
  describe 'associations' do
    it { should belong_to(:tag) }
    it { should belong_to(:space).optional(true) }
  end
end

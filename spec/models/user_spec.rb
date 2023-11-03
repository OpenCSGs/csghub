require 'rails_helper'

RSpec.describe User, type: :model do
  subject(:user) { build(:user) }

  describe 'ROLES' do
    it 'should define an array of roles' do
      expect(User::ROLES).to be_an(Array)
    end

    it 'should contain specific roles' do
      expected_roles = %i(super_user admin personal_user company_user)
      expect(User::ROLES).to contain_exactly(*expected_roles)
    end
  end

  describe 'SUPER_USERS' do
    it 'should be initialized from environment variable' do
      expect(User::SUPER_USERS).to be_an(Array)
      expect(User::SUPER_USERS).not_to be_empty
    end
  end

  describe 'associations' do
    it { should have_many(:spaces).dependent(:destroy) }
  end

  describe '#roles=' do
    it 'sets roles and updates roles_mask' do
      user = User.new
      user.roles = [:admin, :personal_user]

      # Check if roles are set correctly
      user.reload
      expect(user.roles).to contain_exactly(:admin, :personal_user)
    end
  end

  describe '#roles' do
    it 'returns user roles based on roles_mask' do
      user.roles = [:admin, :personal_user]
      # Check if roles are correctly retrieved
      expect(user.roles).to contain_exactly(:admin, :personal_user)
    end

    it 'returns empty array for no roles' do
      user.roles = []
      # Check if roles are empty for no roles_mask
      expect(user.roles).to be_empty
    end
  end

  describe '#has_role?' do
    it 'returns true for an existing role' do
      user.roles = [:admin]
      expect(user.has_role?(:admin)).to be(true)
    end

    it 'returns false for a non-existing role' do
      user.roles = [:admin]
      expect(user.has_role?(:super_user)).to be(false)
    end
  end

  describe '#super_user?' do
    it 'returns true for super user role' do
      user.roles = [:super_user]
      expect(user.super_user?).to be(true)
    end

    it 'returns false for non-super user' do
      user.roles = [:admin]
      expect(user.super_user?).to be(false)
    end
  end

  describe '#admin?' do
    it 'returns true for admin role' do
      user.roles = [:admin]
      expect(user.admin?).to be(true)
    end

    it 'returns true for super user role' do
      user.roles = [:super_user]
      expect(user.admin?).to be(true)
    end

    it 'returns false for non-admin user' do
      user.roles = [:personal_user]
      expect(user.admin?).to be(false)
    end
  end

  describe '#company_user?' do
    it 'returns true for company user role' do
      user.roles = [:company_user]
      expect(user.company_user?).to be(true)
    end

    it 'returns false for non-company user' do
      user.roles = [:admin]
      expect(user.company_user?).to be(false)
    end
  end

  describe 'display_name' do
    it 'returns name if name is present' do
      expect(user.display_name).to eq('Joe')
    end

    it 'returns login_identity if name is not present' do
      user = User.new(login_identity: 'uuid123401')
      expect(user.display_name).to eq('uuid123401')
    end
  end

  describe 'comment_display_name' do
    let(:phone) { '17708176699' }
    let(:uuid) { 'uuid123401' }
    let(:login_identity) { 'uuid123401' }

    it 'returns name if name is present' do
      expect(user.comment_display_name).to eq('Joe')
    end

    it 'returns phone if name and phone are not present' do
      user = User.new(phone: phone)
      expect(user.comment_display_name).to eq(phone)
    end

    it 'returns login_identity if name is not present but phone is present' do
      user = User.new(login_identity: login_identity)
      expect(user.comment_display_name).to eq(uuid)
    end
  end
end

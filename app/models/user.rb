class User < ApplicationRecord
  include BCrypt

  # 特别强调：这里的顺序不能打乱，新的角色依次放在最后
  ROLES = %i(super_user
             admin
             personal_user
             company_user)

  SUPER_USERS = ENV.fetch('SUPER_USERS', []).split(',')

  has_many :org_memberships, dependent: :destroy
  has_many :organizations, through: :org_memberships

  has_many :comments, dependent: :destroy

  has_many :models, as: :owner
  has_many :datasets, as: :owner
  has_many :codes, as: :owner
  has_many :application_spaces, as: :owner
  has_many :endpoints, as: :owner

  has_many :created_models, class_name: 'Model', foreign_key: :creator_id
  has_many :created_datasets, class_name: 'Dataset', foreign_key: :creator_id
  has_many :created_codes, class_name: 'Code', foreign_key: :creator_id
  has_many :created_application_spaces, class_name: 'ApplicationSpace', foreign_key: :creator_id
  has_many :created_endpoints, class_name: 'Endpoint', foreign_key: :creator_id

  # user.roles = "super_user"
  # user.roles = ["super_user", "admin"]
  def roles=(*roles)
    roles = [*roles].flatten.compact.map { |r| r.to_sym }
    self.roles_mask = (roles & ROLES).map { |r| 2**ROLES.index(r) }.inject(0, :+)
  end

  def roles
    ROLES.reject do |r|
    ((roles_mask.to_i || 0) & 2**ROLES.index(r)).zero?
    end
  end

  def has_role?(role)
    roles.include?(role.to_sym)
  end

  def super_user?
    has_role?('super_user') || SUPER_USERS.include?(phone)
  end

  def admin?
    has_role?('admin') || super_user?
  end

  def company_user?
    has_role?('company_user')
  end

  def display_name
    nickname.presence || name.presence || phone.presence || login_identity.presence
  end

  def avatar_url
    if avatar.to_s.match(/^avatar\/*/)
      # retrive the image temp url from aliyun
      AwsS3.instance.download avatar
    elsif avatar.present?
      avatar
    else
      nil
    end
  end

  def available_namespaces
    org_names = organizations.includes(:org_memberships).where.not(org_memberships: {role: 'read'}).pluck(:id, :name).uniq
    [["#{id}_User", name], *org_names.map { |id, name| ["#{id}_Organization", name] }]
  end

  def org_role org
    org_membership_by_org(org)&.role
  end

  def as_json options = nil
    {
      id: id,
      name: name,
      nickname: nickname,
      email: email,
      phone: phone,
      avatar: avatar_url,
      role: roles,
      last_login_at: last_login_at,
      created_at: created_at
    }
  end
end

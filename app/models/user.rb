class User < ApplicationRecord
  include BCrypt

  # 特别强调：这里的顺序不能打乱，新的角色依次放在最后
  ROLES = %i(super_user
             admin
             personal_user
             company_user)

  SUPER_USERS = ENV.fetch('SUPER_USERS', []).split(',')

  validates_uniqueness_of :name, :phone, :email, allow_blank: true, on: :create
  validates_length_of :nickname, maximum: 20
  validates_length_of :email, maximum: 30
  validates :name, format: { with: NAME_RULE }, allow_blank: true
  validates :email, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i }, allow_blank: true

  validate :unique_name_by_organization

  has_many :org_memberships, dependent: :destroy
  has_many :organizations, through: :org_memberships
  has_many :comments, dependent: :destroy
  has_many :created_organizations, class_name: 'Organization', foreign_key: :creator_id

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

  after_save :sync_to_starhub_server

  # user.roles = "super_user"
  # user.roles = ["super_user", "admin"]
  def roles=(*roles)
    roles = [*roles].flatten.map { |r| r.to_sym }
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

  def password
    return nil unless password_hash.present?
    @password ||= Password.new(password_hash)
  end

  def password=(new_password)
    @password = Password.create(new_password)
    self.password_hash = @password
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

  def org_membership_by_org org
    org_memberships.find_by(organization: org)
  end

  def can_manage? repository
    if repository.owner.class == Organization
      org_role(repository.owner) == 'admin'
    else
      self == repository.owner
    end
  end

  def can_write? repository
    if repository.owner.class == Organization
      org_role(repository.owner) == 'admin' || org_role(repository.owner) == 'write'
    else
      self == repository.owner
    end
  end

  def can_read? repository
    if repository.owner.class == Organization
      org_role(repository.owner) == 'admin' || org_role(repository.owner) == 'write' || org_role(repository.owner) == 'read'
    else
      self == repository.owner
    end
  end

  def set_org_role org, role
    membership = org_membership_by_org(org)
    if membership
      membership.update(role: role)
    end
  end

  def starhub_synced!
    # do not trigger the callback again
    self.update_column('starhub_synced', true)
  end

  def starhub_synced?
    starhub_synced == true
  end

  def sync_to_starhub_server
    # user info missing 不同步
    return if name.blank? or email.blank?

    Starhub.api(session_ip).text_secure_check('nickname_detection', "#{name} #{nickname} #{email}")
    Starhub.api(session_ip).image_secure_check('profilePhotoCheck', bucket_name, avatar) if avatar.to_s.match(/^avatar\/*/)

    if starhub_synced?
      res = Starhub.api(session_ip).update_user(name, nickname, email)
      raise StarhubError, res.body unless res.success?
    else
      res = Starhub.api(session_ip).create_user(name, nickname, email)
      raise StarhubError, res.body unless res.success?
      starhub_synced!
    end

    if starhub_synced? && git_token.blank?
      random_name = SecureRandom.uuid
      res_body = Starhub.api(session_ip).generate_git_token(name, random_name)
      res_json = JSON.parse(res_body)
      self.update_columns(git_token_name: res_json["data"]["name"], git_token: res_json["data"]["token"])
    end
  end

  def as_json options = nil
    {
      id: id,
      login_identity: login_identity,
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

  private

  def bucket_name
    AwsS3.instance.bucket_name
  end

  def unique_name_by_organization
    errors.add(:name, 'is already taken') if Organization.where(name: name).exists?
  end
end

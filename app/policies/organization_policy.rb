class OrganizationPolicy < ApplicationPolicy
  def index?
    user.admin?
  end

  def new?
    user.admin?
  end

  def create?
    user.admin?
  end

  def show?
    user.admin?
  end

  def edit?
    user.admin? || user.org_role(record) == 'admin'
  end

  def update?
    user.admin? || user.org_role(record) == 'admin'
  end

  def destroy?
    user.super_user?
  end

  def members?
    user.org_role(record)
  end

  def update_member?
    user.org_role(record) == 'admin'
  end

  def remove_member?
    update_member?
  end

  private

  class Scope < Scope
    def resolve
      Organization.all
    end
  end
end

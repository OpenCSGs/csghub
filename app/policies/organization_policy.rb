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
    user.admin?
  end

  def update?
    user.admin? || belongs_to_current_user?
  end

  def destroy?
    user.super_user?
  end

  class Scope < Scope
    def resolve
      Organization.all
    end
  end
end

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
    user.admin? || is_org_creator?
  end

  def destroy?
    user.super_user?
  end
  
  private

  def is_org_creator?
    record.creator_id == user.id
  end

  class Scope < Scope
    def resolve
      Organization.all
    end
  end
end

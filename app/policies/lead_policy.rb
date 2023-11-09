class LeadPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def edit?
    user.admin?
  end

  def update?
    user.admin?
  end

  def destroy?
    user.super_user?
  end

  class Scope < Scope
    def resolve
      Lead.all
    end
  end
end

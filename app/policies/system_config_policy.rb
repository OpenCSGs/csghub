class SystemConfigPolicy < ApplicationPolicy
  def new?
    user.super_user?
  end

  def index?
    true
  end

  def show?
    true
  end

  def edit?
    user.super_user?
  end

  def update?
    user.super_user?
  end

  def create?
    user.super_user?
  end

  def destroy?
    false
  end

  class Scope < Scope
    def resolve
      SystemConfig.all
    end
  end
end

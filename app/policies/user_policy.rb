class UserPolicy < ApplicationPolicy
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
    user.admin?
  end

  def destroy?
    user.super_user?
  end

  class Scope < Scope
    def resolve
      User.all
    end
  end
end
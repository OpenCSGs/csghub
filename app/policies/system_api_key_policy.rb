class SystemApiKeyPolicy < ApplicationPolicy
  def index?
    user.super_user?
  end

  def new?
    user.super_user?
  end

  def create?
    user.super_user?
  end

  def show?
    user.super_user?
  end

  def edit?
    false
  end

  def update?
    false
  end

  def destroy?
    user.super_user?
  end

  class Scope < Scope
    def resolve
      SystemApiKey.all
    end
  end
end

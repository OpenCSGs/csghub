class DiscussionPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
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
      Discussion.all
    end
  end
end
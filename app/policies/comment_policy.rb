class CommentPolicy < ApplicationPolicy
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
      Comment.all
    end
  end
end
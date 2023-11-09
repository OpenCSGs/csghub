class SpacePolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def edit?
    user.super_user? || (user.login_identity == record.user.login_identity)
  end

  def update?
    user.super_user? || (user.login_identity == record.user.login_identity)
  end

  def destroy?
    user.super_user?
  end

  class Scope < Scope
    def resolve
      if user.nil?
        scope.where(space_type: 'public_s')
      elsif user.admin?
        scope.all
      else
        scope.where(space_type: 'public_s').or(
          scope.where(user_id: user.id)
        )
      end
    end
  end
end
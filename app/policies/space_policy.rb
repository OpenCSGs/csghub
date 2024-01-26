class SpacePolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    record.public_s? || user&.admin? || belongs_to_current_user?
  end

  def edit?
    user.admin? || belongs_to_current_user?
  end

  def update?
    user.admin? || belongs_to_current_user?
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

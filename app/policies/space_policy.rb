class SpacePolicy < ApplicationPolicy
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
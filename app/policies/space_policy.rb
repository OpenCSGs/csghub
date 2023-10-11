class SpacePolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if user.nil?
        scope.where("space_type = ?", 1)
      elsif user.admin?
        scope.all
      else
        scope.where("space_type = ? OR user_id = ?", 1, user.id)
      end
    end
  end
end
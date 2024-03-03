class DailyPaperPolicy < ApplicationPolicy
  def index?
    true
  end

  def new?
    user.admin?
  end

  def create?
    new?
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end

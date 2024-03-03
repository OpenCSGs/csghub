class DailyPaperPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def new?
    user.admin?
  end

  def edit?
    user.admin?
  end

  def update?
    user.admin?
  end

  def create?
    new?
  end

  def destroy?
    user.super_user?
  end

  class Scope < Scope
    def resolve
      DailyPaper.all
    end
  end
end

class CampaignPolicy < ApplicationPolicy
  def new?
    user.admin?
  end

  def index?
    true
  end

  def show?
    true
  end

  def edit?
    user.admin?
  end

  def update?
    user.admin?
  end

  def create?
    user.admin?
  end

  def destroy?
    user.super_user?
  end

  class Scope < Scope
    def resolve
      Campaign.all
    end
  end
end
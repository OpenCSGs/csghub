class ComputingController < ApplicationController
  def index
    @computing_partners = computing_partners.sort_by {|partner| [partner['sort'], partner['name']]}
  end

  private

  def computing_partners
    system_config = SystemConfig.first
    (system_config.computing_partners rescue []) || []
  end
end

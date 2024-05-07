class ComputingController < ApplicationController
  def index
    @computing_partners = COMPUTING_PARTNERS.sort_by {|partner| [partner['sort'], partner['name']]}
  end
end

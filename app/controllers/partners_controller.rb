class PartnersController < ApplicationController
  def index
    @partners = PARTNERS.sort_by {|partner| PinYin.abbr(partner['name'])}
  end

  def apply
  end
end
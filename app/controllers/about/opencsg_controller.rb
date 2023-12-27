class About::OpencsgController < ApplicationController
  def index
    puts "success"
    render layout: 'about/application'
  end
end


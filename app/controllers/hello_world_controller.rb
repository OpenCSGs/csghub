class HelloWorldController < ApplicationController
  def index
    session[:name] = 'hiveer'
    cookies[:name] = 'hiveer'
    cookies[:she] = {
      value: 'a yummy cookie',
      expires: 1.year.from_now,
      domain: 'test.localhost'
    }
  end
end
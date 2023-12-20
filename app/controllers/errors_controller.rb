class ErrorsController < ApplicationController
  def not_found
    render '404', status: 404
  end

  def unauthorized
    render 'unauthorized', status: 401
  end
end

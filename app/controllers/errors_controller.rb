class ErrorsController < ApplicationController
  skip_before_action :check_user_login, :call_event_api

  def not_found
    render '404', status: 404
  end

  def unauthorized
    render 'unauthorized', status: 401
  end
end

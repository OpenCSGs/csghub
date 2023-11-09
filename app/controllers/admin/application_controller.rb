# All Administrate controllers inherit from this
# `Administrate::ApplicationController`, making it the ideal place to put
# authentication logic or other before_actions.
#
# If you want to add pagination or other controller-level concerns,
# you're free to overwrite the RESTful controller actions.
module Admin
  class ApplicationController < Administrate::ApplicationController
    include Administrate::Punditize

    before_action :authenticate_admin

    def authenticate_admin
      if helpers.logged_in? && helpers.current_user.admin?
        return true
      else
        session[:original_request_path] = request.fullpath
        redirect_to login_path
      end
    end

    def current_user
      helpers.current_user
    end

    # Override this value to specify the number of elements to display at a time
    # on index pages. Defaults to 20.
    # def records_per_page
    #   params[:per_page] || 20
    # end
  end
end

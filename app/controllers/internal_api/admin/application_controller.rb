class InternalApi::Admin::ApplicationController < InternalApi::ApplicationController
  before_action :authenticate_admin_user, except: [:license]
end

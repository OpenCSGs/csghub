class SettingsController < ApplicationController
  before_action :authenticate_user

  def profile
  end

  def git_token
  end

  def ssh_keys
    @ssh_keys = SshKey.where(user_id: current_user.id)
  end

  def locale
    # already toggle locale in application_controller/set_default_locale
    redirect_back(fallback_location: root_path)
  end
end

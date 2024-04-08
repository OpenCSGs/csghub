class SettingsController < ApplicationController
  before_action :authenticate_user, except: [:locale]

  def profile
  end

  def git_token
  end

  def ssh_keys
    get_ssh_to_starhub_server
    @ssh_keys = JSON.parse(res.body)["data"]
  end

  def locale
    # already toggle locale in application_controller/set_default_locale
    redirect_back(fallback_location: root_path)
  end

  private

  def get_ssh_to_starhub_server
    res = Starhub.api.get_ssh_key(current_user.name)
    raise StarhubError, res.body unless res.success?
  end
end

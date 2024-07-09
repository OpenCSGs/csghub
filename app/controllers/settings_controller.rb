class SettingsController < ApplicationController
  layout 'repo_application'

  before_action :authenticate_user, except: :locale

  def profile
  end

  def access_token
  end

  def starship_access_token
  end

  def sync_access_token
  end

  def ssh_keys
    res = csghub_api.get_ssh_key(current_user.name, current_user.name)
    raise StarhubError, res.body unless res.success?
    @ssh_keys = JSON.parse(res.body)["data"]
  end

  def locale
    # already toggle locale in application_controller/set_default_locale
    redirect_back(fallback_location: root_path)
  end
end

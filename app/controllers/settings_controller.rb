class SettingsController < ApplicationController
  def profile
  end

  def git_token
  end

  def ssh_key
    @ssh_keys = SshKey.where(user_id: current_user.id).to_a
    puts @ssh_keys
  end
end

require 'jwt'

class SessionsController < ApplicationController
  def new
  end

  def authing
    authing_uuid = cookies[:authingUuid]
    authing_id_token = cookies[:idToken]
    last_login_at = cookies[:lastLoginAt]
    user_infos = JWT.decode(authing_id_token, nil, false).first
    user = User.find_by(login_identity: authing_uuid)
    if user
      helpers.log_in user
      redirect_to root_path
    else
      user = User.create(login_identity: authing_uuid,
                         name: user_infos['username'],
                         phone: user_infos['phone_number'],
                         phone_verified: user_infos['phone_number_verified'],
                         email: user_infos['email'],
                         email_verified: user_infos['email_verified'],
                         gender: user_infos['gender'],
                         last_login_at: last_login_at)
      user.roles = :personal_user
      helpers.log_in user
      redirect_to root_path
    end
  end

  def destroy
    helpers.logout
    redirect_to login_path
  end
end
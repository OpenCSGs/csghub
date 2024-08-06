class InternalApi::UsersController < InternalApi::ApplicationController
  before_action :authenticate_user, except: [:models, :datasets, :codes, :spaces]

  def index
    users = User.where("name ~* ?", params[:name]).limit(10)
    render json: {users: users.as_json}
  end

  def update
    current_user.name = user_params[:name]
    current_user.nickname = user_params[:nickname]
    current_user.email = user_params[:email]
    current_user.phone = user_params[:phone]
    current_user.homepage = user_params[:homepage]
    current_user.bio = user_params[:bio]
    current_user.avatar = user_params[:avatar]
    if current_user.save
      render json: {message: '用户更新成功'}
    else
      render json: {message: current_user.errors.full_messages.to_sentence}, status: 500
    end
  end

  def jwt_token
    res = csghub_api.get_jwt_token(current_user.name)
    token = JSON.parse(res)['data']['token']
    expire_time = Time.parse(JSON.parse(res)['data']['expire_at']).to_time.utc.to_i
    current_domain = Rails.env.development? ? 'localhost' : '.opencsg.com'
    cookies['user_token'] = {value: token, domain: current_domain}
    cookies['token_expire_at'] = expire_time
  end

  def sms
    res = Aliyun::CloudSms.send_msg(params[:phone], ENV['ALIYUN_SMS_TEMPLATE'], {"code": params[:code]})
    response_body = JSON.parse(res)
    if response_body['Message'] == 'OK'
      render json: JSON.parse(res.body)
    else
      render json: {"Message" => response_body['Message']}, status: 400
    end
  end

  private

  def user_params
    params.permit(:name, :nickname, :avatar, :email, :phone, :homepage, :bio)
  end
end

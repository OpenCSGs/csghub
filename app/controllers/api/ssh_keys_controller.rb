class Api::SshKeysController < Api::ApplicationController
  def create
    @ssh_key = SshKey.new(create_params)
    @ssh_key.user_id = current_user.id
    if @ssh_key.save
      render json: { message: '添加成功' }
    else
      render json: { message: @ssh_key.errors.full_messages.to_sentence }, status: :bad_request
    end
  end

  private

  def create_params
    params.permit(:name, :ssh_key)
  end
end


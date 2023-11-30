class Api::SshKeysController < Api::ApplicationController
  def create
    @ssh_key = SshKey.new(create_params)
    @ssh_key.user_id = current_user.id
    if @ssh_key.save
      created_at = @ssh_key.created_at
      current_time = Time.now
      puts "now:", current_time
      puts created_at
      render json: { message: '添加成功', status: true }
    else
      render json: { message: '添加失败', status: false}
    end
  end

  private

  def create_params
    params.permit(:name, :ssh_key)
  end
end


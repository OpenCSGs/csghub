class InternalApi::SshKeysController < InternalApi::ApplicationController
  def create
    res = Starhub.api.create_ssh_key(current_user.name, params[:name], params[:ssh_key])
    raise StarhubError, res.body unless res.success?
    render json: { message: '添加成功' }
  end

  def destroy
    res = Starhub.api.delete_ssh_key(current_user.name, params[:id])
    raise StarhubError, res.body unless res.success?
    render json: {message: "SshKey destroyed"}
  end

  private

  def create_params
    params.permit(:name, :ssh_key)
  end
end

class InternalApi::SshKeysController < InternalApi::ApplicationController
  def create
    sync_to_starhub_server
    render json: { message: '添加成功' }
  end

  def destroy
    delete_from_starhub_server
    render json: {message: "SshKey destroyed"}
  end

  private

  def create_params
    params.permit(:name, :ssh_key)
  end

  def create_ssh_to_starhub_server
    res = Starhub.api.create_ssh_key(current_user.name, params[:name], params[:ssh_key])
    raise StarhubError, res.body unless res.success?
  end

  def delete_ssh_from_starhub_server
    res = Starhub.api.delete_ssh_key(current_user.name, params[:name])
    raise StarhubError, res.body unless res.success?
  end
end

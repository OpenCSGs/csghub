class InternalApi::SshKeysController < InternalApi::ApplicationController
  def create
<<<<<<< Updated upstream
    res = Starhub.api.create_ssh_key(current_user.name, params[:name], params[:ssh_key])
    raise StarhubError, res.body unless res.success?
    render json: { message: '添加成功' }
  end

  def destroy
    res = Starhub.api.delete_ssh_key(current_user.name, params[:id])
    raise StarhubError, res.body unless res.success?
    render json: {message: "SshKey destroyed"}
=======
    @ssh_key = SshKey.new(create_params)
    @ssh_key.user = current_user
    if @ssh_key.save
      render json: { message: I18n.t('repo.createSuccess') }
    else
      render json: { message: @ssh_key.errors.full_messages.to_sentence }, status: :bad_request
    end
  end

  def destroy
    @ssh_key = SshKey.find_by(id: params[:id])
    return render json: { message: "SshKey not found" }, status: :not_found unless @ssh_key
    return render json: { message: "Unauthorized" }, status: :unauthorized unless @ssh_key.user.id == @ssh_key.user_id

    if @ssh_key.destroy
      render json: {message: I18n.t('repo.delSuccess')}
    else
      render json: {message: I18n.t('repo.delFailed')}, status: :bad_request
    end
>>>>>>> Stashed changes
  end

  private

  def create_params
    params.permit(:name, :ssh_key)
  end
end

class InternalApi::SshKeysController < ApplicationController
  def create
    @ssh_key = SshKey.new(create_params)
    @ssh_key.user = current_user
    if @ssh_key.save
      render json: { message: '添加成功' }
    else
      render json: { message: @ssh_key.errors.full_messages.to_sentence }, status: :bad_request
    end
  end

  def destroy
    @ssh_key = SshKey.find_by(id: params[:id])
    return render json: { message: "SshKey not found" }, status: :not_found unless @ssh_key
    return render json: { message: "Unauthorized" }, status: :unauthorized unless @ssh_key.user.id == @ssh_key.user_id

    if @ssh_key.destroy
      render json: {message: "SshKey destroyed"}
    else
      render json: {message: "Failed to destroy SshKey"}, status: :bad_request
    end
  end

  private

  def create_params
    params.permit(:name, :ssh_key)
  end
end


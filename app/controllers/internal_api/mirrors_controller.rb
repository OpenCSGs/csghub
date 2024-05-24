class InternalApi::MirrorsController < InternalApi::ApplicationController
  def create
    mirror = Mirror.new(params)

    if Mirror.save
      render json: { message: "Mirror创建成功" }
    else
      render json: { message: lead.errors.full_messages.to_sentence }, status: :bad_request
    end
  end

  private

  def create_params
  end
end

class InternalApi::CodesController < InternalApi::ApplicationController
  before_action :authenticate_user, except: [:index]

  def index
    res_body = Starhub.api.get_codes(current_user&.name,
                                     params[:search],
                                     params[:sort],
                                     params[:task_tag],
                                     params[:framework_tag],
                                     params[:license_tag],
                                     params[:page],
                                     params[:per_page])
    api_response = JSON.parse(res_body)
    render json: { codes: api_response['data'], total: api_response['total'] }
  end

  def create
    code = current_user.created_codes.build(code_params)
    if code.save
      render json: { path: code.path, message: '代码仓库创建成功!' }, status: :created
    else
      render json: { message: code.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  private

  def code_params
    params.permit(:name, :nickname, :desc, :owner_id, :owner_type, :visibility, :license)
  end
end

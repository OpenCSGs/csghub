class InternalApi::InternationalizeController < InternalApi::ApplicationController

  def index
    if updated_params[:flag] == 'zh'
      I18n.locale = :zh
    else
      I18n.locale = :en
    end
    return redirect_to campaigns_path
  end

  private

  def updated_params
    params.permit(:flag)
  end
end


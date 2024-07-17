module Api::FileOptionsHelper
  extend ActiveSupport::Concern

  private

  def files_options
    {
      ref: params[:branch],
      path: params[:path],
      current_user: current_user&.name
    }
  end
end

module FileOptionsHelper
  extend ActiveSupport::Concern

  private

  def load_branch_and_path
    @default_tab = 'files'
    @current_branch = params[:branch] || 'main'
    @current_path = if request.path.split('/').last.split('.').last == params[:format]
                      "#{params[:path]}.#{params[:format]}"
                    else
                      params[:path]
                    end
  end

  def files_options
    {
      ref: @current_branch,
      path: @current_path,
      current_user: current_user&.name
    }
  end
end
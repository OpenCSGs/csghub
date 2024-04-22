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

  def upload_options
    options = {
      branch: 'main',
      email: current_user&.email,
      message: build_upload_commit_message,
      username: current_user&.name,
      file: [],
      file_path: []
    }
    params[:file_num].to_i.times do |i|
      file_var = "file#{i}"
      file = params[file_var]
      options[:file] << Multipart::Post::UploadIO.new(file.tempfile.path, file.content_type)
      options[:file_path] << file.original_filename
    end
    options
  end
end

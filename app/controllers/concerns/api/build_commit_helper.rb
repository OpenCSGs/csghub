module Api::BuildCommitHelper
  extend ActiveSupport::Concern

  private

  def build_update_commit_message
    build_commit_message('Update')
  end

  def build_upload_commit_message
    build_commit_message('Upload')
  end

  def build_commit_message(type)
    if params[:commit_title].strip.blank? && params[:commit_desc].strip.blank?
      return "#{type} #{params[:path] || params[:file]&.original_filename}"
    end

    "#{params[:commit_title].strip} \n #{params[:commit_desc].strip}"
  end
end
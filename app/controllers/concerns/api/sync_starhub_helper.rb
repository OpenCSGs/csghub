module Api::SyncStarhubHelper
  extend ActiveSupport::Concern

  private

  def sync_create_file(type, options)
    res = Starhub.api.send("create_#{type}_file", params[:namespace], params["#{type}_name"], params[:path], options)
    raise StarhubError, res.body unless res.success?
  end

  def sync_upload_file(type, options)
    res = Starhub.api.send("upload_#{type}_file", params[:namespace], params["#{type}_name"], options)
    raise StarhubError, res.body unless res.success?
  end
end

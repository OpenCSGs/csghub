module Api::SyncStarhubHelper
  extend ActiveSupport::Concern

  private

  def sync_update_file(type, options)
    res = csghub_api.send("update_#{type}_file", params[:namespace], params["#{type}_name"], params[:path], options)
    raise StarhubError, res.body unless res.success?
  end
end

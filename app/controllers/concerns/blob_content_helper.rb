module BlobContentHelper
  extend ActiveSupport::Concern

  private

  def update_blob_content
    if ['jpg', 'png', 'jpeg', 'gif', 'svg'].include? request.url.split('.').last
      content = "<img src='#{request.url.gsub('blob', 'resolve')}'>"
    else
      parsed_blob_content = Base64.decode64(JSON.parse(@blob)['data']['content']).force_encoding('UTF-8')
      content = relative_path_to_resolve_path 'model', parsed_blob_content
    end
    @blob = {data: JSON.parse(@blob)['data'].merge(content: content)}.to_json
  end
end

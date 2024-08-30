module BlobContentHelper
  extend ActiveSupport::Concern

  def resolve_file_or_content(image_api_method, text_api_method, name_key)
    if image_format?(params[:format])
      send_image_data(image_api_method, name_key)
    else
      render_text_data(text_api_method, name_key)
    end
  end

  private
  
  def content_type
    helpers.content_type_format_mapping[params[:format]] || 'text/plain'
  end

  def image_format?(format)
    [
      'jpg', 'jpeg', 'png', 'gif', 'svg',
      'webp', 'avif', 'tiff', 'bmp', 'ico',
      'heic', 'heif'
    ].include?(format.to_s.downcase)
  end

  def send_image_data(api_method, name_key)
    result = call_resolve_api_method(api_method, name_key)
    send_data result, type: content_type, disposition: 'inline'
  end
  
  def render_text_data(api_method, name_key)
    result = call_resolve_api_method(api_method, name_key)
    render plain: JSON.parse(result)['data']
  end
  
  def call_resolve_api_method(api_method, name_key)
    csghub_api.send(api_method,
                    params[:namespace],
                    params[name_key],
                    @current_path,
                    { ref: @current_branch,
                      current_user: current_user&.name })
  end
end

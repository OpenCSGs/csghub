class InternalApi::TagsController < InternalApi::ApplicationController
  def task_tags
    response = {}
    Tag::TAG_FIELD_COLOR_MAPPINGS.keys.each do |field|
      response[field] = {}
      response[field][:color] = Tag::TAG_FIELD_COLOR_MAPPINGS[field][:color]
      response[field][:zh_name] = Tag::TAG_FIELD_COLOR_MAPPINGS[field][:zh_name]
      response[field][:tags] = Tag.where(tag_field: field)
    end
    render json: response.as_json
  end

  def framework_tags
    response = Tag.where(tag_type: 'framework')
    render json: response.as_json
  end

  def language_tags
    response = Tag.where(tag_type: 'language')
    render json: response.as_json
  end
end

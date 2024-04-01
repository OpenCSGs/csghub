module TagListHelper
  extend ActiveSupport::Concern

  private

  def get_tag_list(type)
    response = {}
    tag_fields(type).each do |field|
      response[field] = {}
      response[field][:color] = Tag::TAG_FIELD_COLOR_MAPPINGS[field][:color]
      response[field][:zh_name] = I18n.t("tags.field.#{field}")
      response[field][:tags] = Tag.where(tag_field: field, scope: type.singularize).where.not(name: ignore_tags(type))
    end
    @task_tags = response.as_json
    @framework_tags = Tag.where(tag_type: 'framework').as_json
    @license_tags = Tag.where(tag_type: 'license').order(weight: :asc).as_json
  end

  def tag_fields(type)
    case type
    when 'models'
      Tag::MODEL_TAG_FIELDS
    when 'datasets'
      Tag::DATASET_TAG_FIELDS
    when 'application_spaces'
      Tag::APPLICATION_SPACE_TAG_FIELDS
    when 'codes'
      Tag::CODE_TAG_FIELDS
    end
  end

  def ignore_tags(type)
    system_config = SystemConfig.first
    case type
    when 'models'
      system_config&.ignore_model_tags.present? ? system_config.ignore_model_tags : []
    when 'datasets'
      system_config&.ignore_dataset_tags.present? ? system_config.ignore_dataset_tags : []
    when 'application_spaces'
      []
    when 'codes'
      []
    end
  end
end

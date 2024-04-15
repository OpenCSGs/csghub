class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  NAME_RULE = /\A(?=.{2,64}$)(?!.*[-_.]{2})[a-zA-Z][a-zA-Z0-9_.-]*[a-zA-Z0-9]+\Z/

  def self.human_enum_options(enum_name)
    send(enum_name.to_s.pluralize).map do |key, _|
      [I18n.t("activerecord.enums.#{model_name.i18n_key}.#{enum_name.to_s.pluralize}.#{key}"), key]
    end
  end

  def human_enum_name(enum_name)
    enum_value = send(enum_name)
    return unless enum_value.present?

    I18n.t("activerecord.enums.#{model_name.i18n_key}.#{enum_name.to_s.pluralize}.#{enum_value}")
  end
end

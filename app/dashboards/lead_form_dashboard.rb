require "administrate/base_dashboard"

class LeadFormDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    id: Field::Number,
    campaign: Field::BelongsTo.with_options(scope: -> { Campaign.without_lead_form }),
    channel: Field::String,
    custom_required_fields: Field::String,
    description: Field::Text,
    internal_title: Field::String,
    lead_fields: Field::String,
    lead_form_status: Field::Select.with_options(searchable: false, collection: ->(field) { field.resource.class.send(field.attribute.to_s.pluralize).keys }),
    lead_source: Field::String,
    lead_status: Field::String,
    lead_type: Field::String,
    local_channel: Field::String,
    title: Field::String,
    uuid: Field::String,
    form_url: Field::String,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = %i[
    id
    campaign
    channel
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = %i[
    id
    campaign
    channel
    description
    internal_title
    lead_fields
    lead_form_status
    lead_source
    lead_status
    lead_type
    local_channel
    title
    uuid
    form_url
    created_at
    updated_at
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = %i[
    campaign
    channel
    description
    internal_title
    lead_fields
    lead_form_status
    lead_source
    lead_status
    lead_type
    local_channel
    title
  ].freeze

  # COLLECTION_FILTERS
  # a hash that defines filters that can be used while searching via the search
  # field of the dashboard.
  #
  # For example to add an option to search for open resources by typing "open:"
  # in the search field:
  #
  #   COLLECTION_FILTERS = {
  #     open: ->(resources) { resources.where(open: true) }
  #   }.freeze
  COLLECTION_FILTERS = {}.freeze

  # Overwrite this method to customize how lead forms are displayed
  # across all pages of the admin dashboard.
  #
  def display_resource(lead_form)
    "LeadForm ##{lead_form.title}"
  end
end

require "administrate/base_dashboard"

class LeadDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    id: Field::Number,
    additional_notes: Field::Text,
    channel: Field::String,
    company: Field::String,
    company_site: Field::String,
    email: Field::String,
    email_opt_out: Field::String,
    expertise: Field::Text,
    industry: Field::String,
    introduction: Field::Text,
    lead_form: Field::BelongsTo,
    lead_form_uuid: Field::String,
    lead_source: Field::String,
    lead_status: Field::Select.with_options(include_blank: false, collection: -> { Lead.human_enum_options(:lead_status) }),
    lead_type: Field::String,
    local_channel: Field::String,
    name: Field::String,
    num_of_employees: Field::String,
    phone: Field::String,
    province: Field::String,
    region: Field::String,
    sync_status: Field::String,
    title: Field::String,
    uploads_tag: Field::String,
    computing_demand: Field::Text,
    utm_campaign: Field::String,
    utm_content: Field::String,
    utm_keyword: Field::String,
    utm_medium: Field::String,
    utm_source: Field::String,
    position: Field::String,
    origin: Field::Select.with_options(include_blank: true, collection: -> { Lead.human_enum_options(:origin) }),
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
    lead_type
    lead_source
    channel
    name
    phone
    email
    title
    company
    lead_status
    additional_notes
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = %i[
    id
    additional_notes
    channel
    company
    company_site
    position
    email
    email_opt_out
    expertise
    industry
    introduction
    lead_form
    lead_form_uuid
    lead_source
    lead_status
    lead_type
    local_channel
    name
    num_of_employees
    phone
    province
    region
    sync_status
    title
    uploads_tag
    computing_demand
    utm_campaign
    utm_content
    utm_keyword
    utm_medium
    utm_source
    origin
    created_at
    updated_at
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = %i[
    lead_status
    additional_notes
    channel
    company
    company_site
    position
    email
    email_opt_out
    expertise
    industry
    introduction
    lead_form
    lead_form_uuid
    lead_source
    lead_type
    local_channel
    name
    num_of_employees
    phone
    province
    region
    sync_status
    title
    uploads_tag
    utm_campaign
    utm_content
    utm_keyword
    utm_medium
    utm_source
    origin
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

  # Overwrite this method to customize how leads are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(lead)
  #   "Lead ##{lead.id}"
  # end
end

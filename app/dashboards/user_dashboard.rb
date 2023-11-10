require "administrate/base_dashboard"

class UserDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    id: Field::Number,
    avatar_url: Field::String,
    email: Field::String,
    email_verified: Field::Boolean,
    gender: Field::String,
    last_login_at: Field::DateTime,
    login_identity: Field::String,
    name: Field::String,
    phone: Field::String,
    phone_verified: Field::Boolean,
    roles_mask: Field::Number,
    roles: Field::Select.with_options(include_blank: true, collection: User::ROLES),
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
    company_verified: Field::Boolean
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = %i[
    id
    login_identity
    avatar_url
    roles
    phone
    email
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = %i[
    id
    avatar_url
    email
    email_verified
    gender
    last_login_at
    login_identity
    name
    phone
    phone_verified
    roles
    created_at
    updated_at
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = %i[
    avatar_url
    email
    email_verified
    gender
    last_login_at
    login_identity
    name
    phone
    phone_verified
    roles
    company_verified
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

  # Overwrite this method to customize how users are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(user)
  #   "User ##{user.id}"
  # end
end

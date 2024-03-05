require "administrate/base_dashboard"

class DailyPaperDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    id: Field::Number,
    article_link: Field::String,
    comments: Field::HasMany,
    cover_url: Field::String,
    dataset_links: Field::Text,
    description: Field::String,
    model_links: Field::Text,
    pdf_link: Field::String,
    published_at: Field::DateTime,
    recommendation: Field::String,
    recommender: Field::BelongsTo,
    title: Field::String,
    user_id: Field::Number,
    uuid: Field::String,
    video_link: Field::String,
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
    title
    article_link
    comments
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = %i[
    id
    article_link
    comments
    cover_url
    dataset_links
    description
    model_links
    pdf_link
    published_at
    recommendation
    recommender
    title
    user_id
    uuid
    video_link
    created_at
    updated_at
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = %i[
    article_link
    comments
    cover_url
    dataset_links
    description
    model_links
    pdf_link
    published_at
    recommendation
    recommender
    title
    user_id
    uuid
    video_link
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

  # Overwrite this method to customize how daily papers are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(daily_paper)
  #   "DailyPaper ##{daily_paper.id}"
  # end
end

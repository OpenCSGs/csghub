require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module OpenCSG
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0
    config.session_store :cookie_store, key: "_your_app_session", expire_after: 1.day

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    config.i18n.available_locales = ['en', 'zh']
    config.i18n.default_locale = 'en'
    config.encoding = 'utf-8'

    config.action_mailer.default_url_options = {
      host: ENV.fetch('ASSET_HOST', 'https://opencsg.com'),
      locale: :zh
    }

    config.time_zone = "Beijing"
    # config.eager_load_paths << Rails.root.join("extras")

    config.action_dispatch.default_headers.merge!({'X-Frame-Options' => 'ALLOWALL'})

    config.to_prepare do
      Administrate::ApplicationController.helper OpenCSG::Application.helpers
    end
  end
end

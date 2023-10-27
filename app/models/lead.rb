class Lead < ApplicationRecord
  belongs_to :landing_page, primary_key: :uuid, foreign_key: :landing_page_uuid, optional: true
end

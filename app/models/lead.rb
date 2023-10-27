class Lead < ApplicationRecord
  belongs_to :lead_form, primary_key: :uuid, foreign_key: :lead_form_uuid, optional: true
end

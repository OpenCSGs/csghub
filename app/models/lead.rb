class Lead < ApplicationRecord
  validates :name, :phone, :company, presence: true
  belongs_to :lead_form, primary_key: :uuid, foreign_key: :lead_form_uuid, optional: true
end

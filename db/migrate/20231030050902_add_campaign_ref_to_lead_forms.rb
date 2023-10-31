class AddCampaignRefToLeadForms < ActiveRecord::Migration[7.0]
  def change
    add_reference :lead_forms, :campaign, null: false, foreign_key: true
  end
end

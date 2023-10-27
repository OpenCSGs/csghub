class CreateLeadForms < ActiveRecord::Migration[7.0]
  def change
    create_table :lead_forms do |t|
      t.string :lead_source
      t.string :channel
      t.string :lead_status
      t.string :local_channel
      t.string :lead_type
      t.string :lead_fields
      t.string :uuid
      t.string :lead_form_status, default: 'active'
      t.string :title
      t.string :internal_title
      t.text :description
      t.string :custom_required_fields

      t.timestamps
    end
  end
end

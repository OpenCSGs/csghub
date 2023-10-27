class CreateLeads < ActiveRecord::Migration[7.0]
  def change
    create_table :leads do |t|
      t.text :additional_notes
      t.string :channel
      t.string :lead_type
      t.string :company
      t.string :email
      t.string :email_opt_out
      t.string :phone
      t.string :name
      t.string :num_of_employees
      t.string :province
      t.string :title
      t.string :utm_content
      t.string :utm_medium
      t.string :utm_source
      t.string :lead_source
      t.string :region
      t.string :utm_campaign
      t.string :sync_status
      t.string :industry
      t.string :local_channel
      t.string :uploads_tag
      t.string :lead_status
      t.string :landing_page_uuid
      t.string :utm_keyword

      t.timestamps
    end
  end
end

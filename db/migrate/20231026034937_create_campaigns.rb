class CreateCampaigns < ActiveRecord::Migration[7.0]
  def change
    create_table :campaigns do |t|
      t.string :name
      t.string :uuid
      t.string :location
      t.datetime :start_date
      t.datetime :end_date

      t.index ["uuid"], name: "index_campaigns_on_uuid"

      t.timestamps
    end
  end
end

class CreateDailyPapers < ActiveRecord::Migration[7.0]
  def change
    create_table :daily_papers do |t|
      t.integer :user_id
      t.string :uuid
      t.string :title
      t.string :article_link
      t.datetime :published_at
      t.string :pdf_link
      t.string :recommendation
      t.string :cover_url
      t.string :description
      t.string :video_link
      t.string :model_links, array: true, default: []
      t.string :dataset_links, array: true, default: []

      t.timestamps
    end
  end
end

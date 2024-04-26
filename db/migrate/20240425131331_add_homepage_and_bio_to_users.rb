class AddHomepageAndBioToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :homepage, :string
    add_column :users, :bio, :text
  end
end

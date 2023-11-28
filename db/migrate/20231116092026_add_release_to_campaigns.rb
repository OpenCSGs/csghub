class AddReleaseToCampaigns < ActiveRecord::Migration[7.0]
  def change
    add_column :campaigns, :release, :boolean, default: false
  end
end

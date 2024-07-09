class AddUserChannelToLeads < ActiveRecord::Migration[7.0]
  def change
    add_column :leads, :user_channel, :string
  end
end

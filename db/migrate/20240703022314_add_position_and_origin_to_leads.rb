class AddPositionAndOriginToLeads < ActiveRecord::Migration[7.0]
  def change
    add_column :leads, :position, :string
    add_column :leads, :origin, :string
  end
end

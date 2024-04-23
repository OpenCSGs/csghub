class AddDemandToLead < ActiveRecord::Migration[7.0]
  def change
    add_column :leads, :demand, :text, default: ''
  end
end

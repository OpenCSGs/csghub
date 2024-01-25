class AddComputingDemandToLead < ActiveRecord::Migration[7.0]
  def change
    add_column :leads, :computing_demand, :text
  end
end

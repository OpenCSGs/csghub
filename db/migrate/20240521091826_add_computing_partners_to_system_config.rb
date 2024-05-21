class AddComputingPartnersToSystemConfig < ActiveRecord::Migration[7.0]
  def change
    add_column :system_configs, :computing_partners, :jsonb, default: {}
  end
end

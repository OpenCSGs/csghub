class AddInternalMailGroupToSystemConfig < ActiveRecord::Migration[7.0]
  def change
    add_column :system_configs, :internal_mail_group, :jsonb, default: {}
  end
end

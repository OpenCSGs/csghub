class AddFieldsToLeads < ActiveRecord::Migration[7.0]
  def change
    add_column :leads, :expertise, :text
    add_column :leads, :introduction, :text
    add_column :leads, :company_site, :string
  end
end

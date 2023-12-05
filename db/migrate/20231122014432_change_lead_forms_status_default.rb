class ChangeLeadFormsStatusDefault < ActiveRecord::Migration[7.0]
  def change
    change_column_default :lead_forms, :lead_form_status, 'inactive'
  end
end

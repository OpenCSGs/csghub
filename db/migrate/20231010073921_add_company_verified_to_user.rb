class AddCompanyVerifiedToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :company_verified, :boolean, default: false
  end
end

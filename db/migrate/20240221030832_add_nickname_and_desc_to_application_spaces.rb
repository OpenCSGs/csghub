class AddNicknameAndDescToApplicationSpaces < ActiveRecord::Migration[7.0]
  def change
    add_column :application_spaces, :nickname, :string
    add_column :application_spaces, :desc, :text
  end
end

class AddNicknameAndDescToModel < ActiveRecord::Migration[7.0]
  def change
    add_column :models, :nickname, :string
    add_column :models, :desc, :text
  end
end

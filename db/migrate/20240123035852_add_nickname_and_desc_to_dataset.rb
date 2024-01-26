class AddNicknameAndDescToDataset < ActiveRecord::Migration[7.0]
  def change
    add_column :datasets, :nickname, :string
    add_column :datasets, :desc, :text
  end
end

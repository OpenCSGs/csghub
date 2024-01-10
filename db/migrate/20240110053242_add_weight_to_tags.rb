class AddWeightToTags < ActiveRecord::Migration[7.0]
  def change
    add_column :tags, :weight, :integer
  end
end

class AddLabelToTags < ActiveRecord::Migration[7.0]
  def change
    add_column :tags, :label, :string
  end
end

class AddScopeToTags < ActiveRecord::Migration[7.0]
  def change
    add_column :tags, :scope, :string
  end
end

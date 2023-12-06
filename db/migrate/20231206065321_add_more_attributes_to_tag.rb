class AddMoreAttributesToTag < ActiveRecord::Migration[7.0]
  def change
    add_column :tags, :tag_origin, :string, default: 'user_created'
    add_column :tags, :tag_type, :string, default: 'task'
    add_column :tags, :tag_field, :string
    add_column :tags, :zh_name, :string
    add_column :tags, :desc, :text
  end
end

class AddCoverImageToSpace < ActiveRecord::Migration[7.0]
  def change
    add_column :spaces, :cover_image, :string
  end
end

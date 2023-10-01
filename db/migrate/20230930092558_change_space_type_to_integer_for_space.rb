class ChangeSpaceTypeToIntegerForSpace < ActiveRecord::Migration[7.0]
  def change
    change_column :spaces, :space_type, 'integer USING CAST(space_type AS integer)
  end
end

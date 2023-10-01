class ChangeSpaceTypeToIntegerForSpace < ActiveRecord::Migration[7.0]
  def change
    change_column :spaces, :space_type, :integer, using: 'space_type::integer'
  end
end

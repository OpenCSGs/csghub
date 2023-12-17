class AddCreatorToModels < ActiveRecord::Migration[7.0]
  def change
    add_reference :models, :creator, foreign_key: { to_table: :users }
  end
end

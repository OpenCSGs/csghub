class RemovenameFromMirrors < ActiveRecord::Migration[7.0]
  def change
    remove_column :mirrors, :repo_type
    remove_column :mirrors, :repo_id
  end
end

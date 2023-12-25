class AddGitTokenNameToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :git_token_name, :string
  end
end

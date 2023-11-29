class AddGitTokenToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :git_token, :string
  end
end

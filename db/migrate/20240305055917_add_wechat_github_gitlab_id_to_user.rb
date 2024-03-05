class AddWechatGithubGitlabIdToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :wechat_id, :string
    add_column :users, :github_id, :string
    add_column :users, :gitlab_id, :string
  end
end

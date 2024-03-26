# frozen_string_literal: true

desc 'Generate git token for existing user'
task generate_git_token: :environment do
  User.where(starhub_synced: true).each do |user|
    if user.git_token.blank?
      random_name = SecureRandom.uuid
      res_body = Starhub.api.generate_git_token(user.name, random_name)
      res_json = JSON.parse(res_body)
      user.update_columns(git_token_name: res_json["data"]["name"], git_token: res_json["data"]["token"])
      puts "User: #{user.reload.name}, GitToken: #{user.git_token}"
    end
  end
end

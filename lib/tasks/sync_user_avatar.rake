# frozen_string_literal: true

desc 'Sync user avatar'
task sync_user_avatar: :environment do
  User.all.each do |user|
    if user.avatar.present?
      puts "current user: #{user.name} #{user.avatar}"
      res = Starhub.api.update_user_avatar(user.name, user.avatar)
      if res.success?
        puts "synced"
      else
        puts res.body
      end
    end
  end
end

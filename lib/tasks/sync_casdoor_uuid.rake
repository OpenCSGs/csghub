# frozen_string_literal: true

desc "Sync user login_identity to csghub server"
task sync_login_identity: :environment do
  User.all.each do |user|
    if user.starhub_synced?
      res = Starhub.api.update_user(user.name,
                                    user.nickname,
                                    user.email,
                                    user.phone,
                                    user.login_identity)
      if res.success?
        puts "#{user.name} synced"
      else
        puts "#{user.name} failed to synced"
      end
    end
  end
end

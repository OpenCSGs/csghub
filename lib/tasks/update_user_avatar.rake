# frozen_string_literal: true

desc 'Update user avatar'
task update_user_avatar: :environment do
  User.all.each do |user|
    if user.avatar.present? && user.avatar.match(/^avatar\/.*/)
      puts "current avatar: #{user.avatar}"
      public_url = AwsS3.instance.download user.avatar
      user.update_column :avatar, public_url
      puts "updated avatar: #{public_url}"
    end
  end
end

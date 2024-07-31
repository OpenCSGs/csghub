# frozen_string_literal: true

desc 'Sync org logo'
task :sync_org_logo, [:username] => :environment do |_, args|
  args.with_defaults(username: nil)
  if args.username.nil?
    puts "Please provide username"
    exit
  end

  Organization.all.each do |org|
    if org.logo.present?
      puts "username: #{args.username}"
      puts "current org: #{org.name} #{org.logo}"
      res = Starhub.api.update_org_logo(args.username, org.name, org.logo)
      if res.success?
        puts "synced"
      else
        puts res.body
      end
    end
  end
end

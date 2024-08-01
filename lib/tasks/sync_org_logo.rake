# frozen_string_literal: true

desc 'Sync org logo'
task sync_org_logo: :environment do
  Organization.all.each do |org|
    if org.logo.present? && org.creator.present?
      puts "current org: #{org.creator.name}/#{org.name} #{org.logo}"
      res = Starhub.api.update_org_logo(org.creator.name,
                                        org.name,
                                        org.logo,
                                        org.homepage,
                                        org.org_type)
      if res.success?
        puts "synced"
      else
        puts res.body
      end
    end
  end
end

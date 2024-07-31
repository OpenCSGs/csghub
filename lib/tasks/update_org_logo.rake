# frozen_string_literal: true

desc 'Update org logo'
task update_org_logo: :environment do
  Organization.all.each do |org|
    if org.logo.present? && org.logo.match(/^org_logo\/.*/)
      puts "current logo: #{org.logo}"
      public_url = AwsS3.instance.download org.logo
      org.update_column :logo, public_url
      puts "updated logo: #{public_url}"
    end
  end
end

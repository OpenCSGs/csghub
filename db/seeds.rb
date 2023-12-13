# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

#初始化默认的四个 Space Tag
Tag::DEFAULT_TAGS.each do |htag|
  tag = Tag.find_by(name: htag[:name])
  next if tag
  puts "creating tag: #{htag[:name]}"
  Tag.create(name: htag[:name], color: htag[:color])
end

if SystemConfig.first.blank?
  if Rails.env.development?
    SystemConfig.create(application_env: 'development')
  elsif Rails.env.staging?
    SystemConfig.create(application_env: 'staging')
  else
    SystemConfig.create(application_env: 'production')
  end
end

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

#初始化默认的四个 Space Tag
{'语言模型': '#009933', '图片模型': '#ff9900', '多模态': '#cc0066', '智能体': '#cc33ff'}.each do |tag_name, color|
  tag = Tag.find_by(name: tag_name)
  next if tag
  puts "creating tag: #{tag_name}"
  Tag.create(name: tag_name, color: color)
end
